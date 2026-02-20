import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import AssetGrid from "../../components/AssetGrid";
import AssetModal from "../../components/AssetModal";
import UploadModal from "../../components/UploadModal";
import { Toaster, toast } from "sonner";
import AuthGuard from "../../components/auth/AuthGuard";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setAssets } from "@/store/slices/assetsSlice";
import { BASE_URL } from "@/utils/constants";
import { filterAssets } from "../../components/home/filterAssets";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { assets } = useSelector((state) => state.assets);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("created_on");

  useEffect(() => {
    if (!router.isReady) return;

    setSearchQuery(router.query.search ?? "");
    setFilterType(router.query.type ?? "all");
    setSortBy(router.query.sortBy ?? "created_on");
  }, [router.isReady]);

  useEffect(() => {
    if (!router.isReady) return;

    const query = {
      ...(searchQuery && { search: searchQuery }),
      ...(filterType !== "all" && { type: filterType }),
      ...(sortBy !== "created_on" && { sortBy }),
    };

    router.replace(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true },
    );
  }, [searchQuery, filterType, sortBy]);

 
  // FETCH ASSETS

  const getAssets = async () => {
    if (!user?.userId) return;
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/assets/getAssets/${user.userId}`,
      );
      dispatch(setAssets(res.data.result));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAssets();
  }, [user]);


  const handleDelete = async (assetId) => {
    if (!user?.userId || !assetId) return;
    try {
      const res = await axios.delete(
        `${BASE_URL}/api/assets/deleteAsset/${user.userId}/${assetId}`,
      );

      if (res?.data?.success === false) {
        toast.error(res?.data?.message || "Failed to delete asset.");
        return;
      }

      setSelectedAsset(null);
      getAssets();
      toast.success(res?.data?.message || "Asset deleted successfully.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete asset.",
      );
    }
  };

  //  FILTER / SORT LOGIC
  
  const filteredAssets = useMemo(() => {
    return filterAssets({
      assets,
      searchQuery,
      filterType,
      sortBy,
    });
  }, [assets, searchQuery, filterType, sortBy]);

 
  
  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] overflow-hidden">
        <Toaster position="bottom-right" />

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`fixed inset-y-0 left-0 z-50 lg:static transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        <main className="flex-1 flex flex-col min-w-0 h-full">
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            onUploadClick={() => setIsUploadModalOpen(true)}
            onSearch={setSearchQuery}
          />

          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-black dark:text-white">
                  Assets
                </h1>
                <p className="text-[#999999] mt-1">
                  Manage and organize your creative media
                </p>
              </div>

              <AssetGrid
                assets={filteredAssets}
                isLoading={isLoading}
                onAssetClick={setSelectedAsset}
                onDeleteAsset={handleDelete}
                filter={filterType}
                setFilter={setFilterType}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </div>
          </div>
        </main>

        {selectedAsset && (
          <AssetModal
            asset={selectedAsset}
            onClose={() => setSelectedAsset(null)}
            onDelete={handleDelete}
          />
        )}

        {isUploadModalOpen && (
          <UploadModal
            onClose={() => setIsUploadModalOpen(false)}
            onUpload={() => {}}
          />
        )}
      </div>
    </AuthGuard>
  );
}
