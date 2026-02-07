import { useState, useEffect, useMemo } from "react";
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


export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("created_on");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { assets } = useSelector((state) => state.assets);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  // Fetch Assets
  const getAssets = async () => {
    if (!user?.userId) return;
    setIsLoading(true);
    try {
      console.log("fetching assets for user", user);
      const res = await axios.get(
        `${BASE_URL}/api/assets/getAssets/${user?.userId}`,
      );
      dispatch(setAssets(res.data.result));
      console.log("assets are", res.data.assets);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = () => {};

  const handleDelete = async (assetId) => {
    if (!user?.userId || !assetId) return;
    try {
      const res = await axios.delete(
        `${BASE_URL}/api/assets/deleteAsset/${user?.userId}/${assetId}`,
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

  useEffect(() => {
    getAssets();
  }, [user]);

  const filteredAssets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const matchesQuery = (asset) => {
      if (!query) return true;
      const name = (asset.name || "").toLowerCase();
      const tags = Array.isArray(asset.tags)
        ? asset.tags.join(" ").toLowerCase()
        : (asset.tags || "").toString().toLowerCase();
      return name.includes(query) || tags.includes(query);
    };

    const normalizeType = (asset) => {
      const type = (asset.type || "").toLowerCase();
      if (["image", "video", "audio"].includes(type)) return type;
      return "document";
    };

    const matchesFilter = (asset) => {
      if (filterType === "all") return true;
      return normalizeType(asset) === filterType;
    };

    const compareBy = (a, b) => {
      if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      }
      if (sortBy === "size") {
        return (b.size || 0) - (a.size || 0);
      }
      const aDate = new Date( a.created_on || 0).getTime();
      const bDate = new Date( b.created_on || 0).getTime();
      return bDate - aDate;
    };

    return assets.filter(matchesQuery).filter(matchesFilter).sort(compareBy);
  }, [assets, searchQuery, filterType, sortBy]);

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] overflow-hidden">
        <Toaster position="bottom-right" />
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
        fixed inset-y-0 left-0 z-50 lg:static lg:block transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 h-full relative">
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            onUploadClick={() => setIsUploadModalOpen(true)}
            onSearch={setSearchQuery}
          />

          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-sora font-bold text-black dark:text-white">
                    Assets
                  </h1>
                  <p className="text-[#999999] mt-1">
                    Manage and organize your creative media
                  </p>
                </div>
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

        {/* Modals */}
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
            onUpload={handleUpload}
          />
        )}
      </div>
    </AuthGuard>
  );
}
