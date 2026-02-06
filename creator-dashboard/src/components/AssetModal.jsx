import {
  X,
  Download,
  Trash2,
  Edit2,
  Calendar,
  HardDrive,
  Hash,
  Type,
} from "lucide-react";

const formatSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default function AssetModal({ asset, onClose, onDelete }) {
  if (!asset) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="bg-white dark:bg-[#111111] w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-full text-white md:text-[#666666] dark:md:text-[#888888] hover:bg-black/20 dark:hover:bg-white/20 transition-all"
        >
          <X size={20} />
        </button>

        {/* Left: Preview */}
        <div className="flex-1 bg-[#F5F5F5] dark:bg-[#0A0A0A] flex items-center justify-center p-4 min-h-[300px]">
          {asset.type === "image" ? (
            <img
              src={asset.file_url || asset.thumbnail_url}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              alt={asset.name}
            />
          ) : asset.type === "video" ? (
            <video
              controls
              className="max-w-full max-h-full rounded-lg shadow-lg"
            >
              <source src={asset.file_url} />
            </video>
          ) : asset.type === "audio" ? (
            <div className="flex flex-col items-center gap-6 w-full max-w-md">
              <div className="w-32 h-32 bg-black dark:bg-white rounded-3xl flex items-center justify-center shadow-xl">
                <img
                  src={asset.thumbnail_url}
                  className="w-full h-full object-cover rounded-3xl opacity-50"
                  alt="Audio thumb"
                />
              </div>
              <audio controls className="w-full">
                <source src={asset.file_url} />
              </audio>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-[#999999]">
              <div className="w-24 h-24 bg-white dark:bg-[#1A1A1A] rounded-2xl flex items-center justify-center border border-[#EEEEEE] dark:border-[#333333]">
                <Type size={40} />
              </div>
              <span className="font-semibold">{asset.name}</span>
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-[380px] p-6 md:p-8 overflow-y-auto bg-white dark:bg-[#111111] border-l border-[#EEEEEE] dark:border-[#222222]">
          <div className="mb-8">
            <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-2 leading-tight">
              {asset.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold uppercase tracking-wider rounded-lg">
                {asset.type}
              </span>
              <span className="px-2.5 py-1 bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#EEEEEE] dark:border-[#333333] text-[10px] font-bold text-[#666666] dark:text-[#888888] rounded-lg">
                VERIFIED
              </span>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#F5F5F5] dark:bg-[#1A1A1A] flex items-center justify-center text-[#666666] dark:text-[#888888]">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#999999] uppercase tracking-wider">
                  Added on
                </p>
                <p className="text-sm font-semibold text-black dark:text-white">
                  {new Date(asset.created_at).toLocaleDateString(undefined, {
                    dateStyle: "long",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#F5F5F5] dark:bg-[#1A1A1A] flex items-center justify-center text-[#666666] dark:text-[#888888]">
                <HardDrive size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#999999] uppercase tracking-wider">
                  File Size
                </p>
                <p className="text-sm font-semibold text-black dark:text-white">
                  {formatSize(asset.size)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#F5F5F5] dark:bg-[#1A1A1A] flex items-center justify-center text-[#666666] dark:text-[#888888] flex-shrink-0">
                <Hash size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-[#999999] uppercase tracking-wider mb-2">
                  Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {asset.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-[#F5F5F5] dark:bg-[#1A1A1A] text-xs font-medium text-[#666666] dark:text-[#AAAAAA] rounded-lg border border-[#EEEEEE] dark:border-[#333333]"
                    >
                      #{tag}
                    </span>
                  ))}
                  <button className="px-2.5 py-1 border border-dashed border-[#DDDDDD] dark:border-[#444444] text-xs text-[#999999] rounded-lg hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-all">
                    + Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-auto pt-8 border-t border-[#EEEEEE] dark:border-[#222222]">
            <button className="h-11 flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold text-sm hover:opacity-90 transition-all">
              <Download size={18} />
              Download
            </button>
            <button className="h-11 flex items-center justify-center gap-2 border border-[#EEEEEE] dark:border-[#333333] text-black dark:text-white rounded-xl font-semibold text-sm hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] transition-all">
              <Edit2 size={18} />
              Edit
            </button>
            <button
              onClick={() => onDelete(asset.id)}
              className="col-span-2 h-11 flex items-center justify-center gap-2 text-red-500 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
            >
              <Trash2 size={18} />
              Delete Asset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



