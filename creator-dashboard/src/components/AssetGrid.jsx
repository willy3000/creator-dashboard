import { useState, useEffect } from "react";
import { LayoutGrid, List, ChevronDown, Filter } from "lucide-react";
import AssetCard from "./AssetCard";
import { create } from "domain";

export default function AssetGrid({
  assets,
  isLoading,
  onAssetClick,
  onDeleteAsset,
  filter,
  setFilter,
  sortBy,
  setSortBy,
}) {
  const [viewType, setViewType] = useState("grid");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const fileTypes = ["all", "image", "video", "audio", "document", "3D Object"];

  // Reset page when filter or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(assets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAssets = assets.slice(startIndex, endIndex);

  const sortLabels = {
    created_at: "Date",
    name: "Name",
    size: "Size",
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1A1A1A] border border-[#EEEEEE] dark:border-[#333333] rounded-2xl overflow-hidden animate-pulse"
            >
              <div className="aspect-video bg-[#F5F5F5] dark:bg-[#222222]"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-[#F5F5F5] dark:bg-[#222222] rounded w-3/4"></div>
                <div className="flex justify-between">
                  <div className="h-3 bg-[#F5F5F5] dark:bg-[#222222] rounded w-1/4"></div>
                  <div className="h-3 bg-[#F5F5F5] dark:bg-[#222222] rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {fileTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                filter === type
                  ? "bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/5"
                  : "bg-white dark:bg-[#1A1A1A] text-[#666666] dark:text-[#888888] border border-[#EEEEEE] dark:border-[#333333] hover:border-black dark:hover:border-white"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}s
            </button>
          ))}
        </div>

        {/* Sort + View Toggle */}
        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <div className="relative group">
            <button className="h-10 px-4 bg-white dark:bg-[#1A1A1A] border border-[#EEEEEE] dark:border-[#333333] rounded-xl flex items-center gap-2 text-sm font-semibold text-black dark:text-white hover:border-black dark:hover:border-white transition-all">
              <span>
                {/* refactord and made cleaner by using an object of sort by items*/}
                Sort by: {sortLabels[sortBy]}
              </span>
              <ChevronDown size={14} />
            </button>

            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1A1A1A] border border-[#EEEEEE] dark:border-[#333333] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
              <button
                onClick={() => setSortBy("created_at")}
                className="w-full px-4 py-3 text-left text-sm hover:bg-[#F5F5F5] dark:hover:bg-[#222222] text-black dark:text-white transition-all"
              >
                Newest First
              </button>
              <button
                onClick={() => setSortBy("name")}
                className="w-full px-4 py-3 text-left text-sm hover:bg-[#F5F5F5] dark:hover:bg-[#222222] text-black dark:text-white transition-all"
              >
                Name (A-Z)
              </button>
              <button
                onClick={() => setSortBy("size")}
                className="w-full px-4 py-3 text-left text-sm hover:bg-[#F5F5F5] dark:hover:bg-[#222222] text-black dark:text-white transition-all"
              >
                File Size
              </button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-[#F5F5F5] dark:bg-[#1E1E1E] p-1 rounded-xl border border-[#EEEEEE] dark:border-[#333333]">
            <button
              onClick={() => setViewType("grid")}
              className={`p-1.5 rounded-lg transition-all ${
                viewType === "grid"
                  ? "bg-white dark:bg-[#333333] shadow-sm text-black dark:text-white"
                  : "text-[#999999] hover:text-black dark:hover:text-white"
              }`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewType("list")}
              className={`p-1.5 rounded-lg transition-all ${
                viewType === "list"
                  ? "bg-white dark:bg-[#333333] shadow-sm text-black dark:text-white"
                  : "text-[#999999] hover:text-black dark:hover:text-white"
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Assets */}
      {assets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#111111] border border-dashed border-[#DDDDDD] dark:border-[#333333] rounded-3xl">
          <div className="w-16 h-16 bg-[#F5F5F5] dark:bg-[#1E1E1E] rounded-full flex items-center justify-center mb-4">
            <Filter size={32} className="text-[#999999]" />
          </div>
          <h3 className="text-xl font-bold text-black dark:text-white mb-2">
            No assets found
          </h3>
          <p className="text-[#999999] max-w-xs text-center text-sm">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <>
          <div
            className={
              viewType === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12"
                : "flex flex-col gap-3 pb-12"
            }
          >
            {paginatedAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                viewType={viewType}
                onClick={onAssetClick}
                onDelete={onDeleteAsset}
              />
            ))}
          </div>
        </>
      )}

      {/* //Pagination added */}
      <div className={"flex items-center justify-center gap-2 mt-8"}>
        <button
          onClick={() => handlePrev()}
          className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${"bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/5"}`}
        >
          Prev
        </button>
        <p className="text-sm text-black dark:text-white">
          {currentPage} of {totalPages}
        </p>
        <button
          onClick={() => handleNext()}
          className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${"bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/5"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
