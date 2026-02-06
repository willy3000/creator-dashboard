import {
  ImageIcon,
  Video,
  Music,
  FileText,
  MoreHorizontal,
  Download,
  Trash2,
  Eye,
} from "lucide-react";

const getIcon = (type) => {
  switch (type) {
    case "image":
      return <ImageIcon size={20} />;
    case "video":
      return <Video size={20} />;
    case "audio":
      return <Music size={20} />;
    default:
      return <FileText size={20} />;
  }
};

const formatSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default function AssetCard({ asset, viewType, onClick, onDelete }) {
  const isGrid = viewType === "grid";

  if (!isGrid) {
    return (
      <div
        onClick={() => onClick(asset)}
        className="flex items-center gap-4 p-3 bg-white dark:bg-[#1A1A1A] border border-[#EEEEEE] dark:border-[#333333] rounded-xl hover:border-black dark:hover:border-white transition-all cursor-pointer group"
      >
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F5F5F5] dark:bg-[#111111] flex items-center justify-center flex-shrink-0 border border-[#EEEEEE] dark:border-[#222222]">
          {asset.thumbnail_url ? (
            <img
              src={asset.thumbnail_url}
              className="w-full h-full object-cover"
              alt={asset.name}
            />
          ) : (
            <div className="text-[#999999]">{getIcon(asset.type)}</div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-black dark:text-white truncate">
            {asset.name}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#999999]">
              {asset.type}
            </span>
            <span className="w-1 h-1 bg-[#DDDDDD] dark:bg-[#444444] rounded-full"></span>
            <span className="text-[11px] text-[#999999]">
              {new Date(asset.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 px-4 hidden md:flex">
          <div className="flex -space-x-1">
            {asset.tags?.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-[#F5F5F5] dark:bg-[#222222] text-[10px] font-medium text-[#666666] dark:text-[#AAAAAA] rounded-full border border-[#EEEEEE] dark:border-[#333333]"
              >
                #{tag}
              </span>
            ))}
          </div>
          <span className="text-xs text-[#999999] w-20 text-right">
            {formatSize(asset.size)}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(asset.id);
          }}
          className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 text-[#999999] hover:text-red-500 rounded-lg transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => onClick(asset)}
      className="bg-white dark:bg-[#1A1A1A] border border-[#EEEEEE] dark:border-[#333333] rounded-2xl overflow-hidden hover:border-black dark:hover:border-white hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
    >
      <div className="aspect-video bg-[#F5F5F5] dark:bg-[#111111] relative overflow-hidden flex items-center justify-center">
        {asset.thumbnail_url ? (
          <img
            src={asset.thumbnail_url}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
            alt={asset.name}
          />
        ) : (
          <div className="text-[#999999] scale-150">{getIcon(asset.type)}</div>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button className="p-2 bg-white rounded-full text-black hover:scale-110 transition-transform">
            <Eye size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(asset.id);
            }}
            className="p-2 bg-white rounded-full text-red-500 hover:scale-110 transition-transform"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg flex items-center gap-1.5 shadow-sm">
          <span className="text-black dark:text-white">
            {getIcon(asset.type)}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-black dark:text-white">
            {asset.type}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h4 className="font-semibold text-black dark:text-white truncate mb-1">
          {asset.name}
        </h4>
        <div className="flex items-center justify-between text-[#999999] text-xs">
          <span>{new Date(asset.created_at).toLocaleDateString()}</span>
          <span>{formatSize(asset.size)}</span>
        </div>

        {asset.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {asset.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-[#F5F5F5] dark:bg-[#222222] text-[10px] text-[#666666] dark:text-[#AAAAAA] rounded-md border border-[#EEEEEE] dark:border-[#333333]"
              >
                #{tag}
              </span>
            ))}
            {asset.tags.length > 3 && (
              <span className="text-[10px] text-[#999999] ml-1">
                +{asset.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
