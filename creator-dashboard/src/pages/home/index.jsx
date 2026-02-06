import { useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import AssetGrid from "../../components/AssetGrid";
import AssetModal from "../../components/AssetModal";
import UploadModal from "../../components/UploadModal";
import { Toaster, toast } from "sonner";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [assets, setAssets] = useState([
    {
      id: 0,
      name: "Test File",
      size: 12000,
      type: "image",
      tags: ["header", "logo"],
      created_at: "2026-02-06T10:30:00Z",
      thumbnail_url: "https://plus.unsplash.com/premium_photo-1708834156501-02ed54c10542?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8"
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Assets

  const handleUpload = () => {};

  const handleDelete = () => {};

  return (
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
              assets={assets}
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
  );
}
