import { useState } from "react";
import { X, Upload, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";


export default function UploadModal({ onClose, onUpload }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "image",
    tags: "",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {user} = useSelector((state) => state.user);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!formData.name) {
        setFormData((prev) => ({
          ...prev,
          name: selectedFile.name.split(".")[0],
        }));
      }
      // Infer type from file mime
      if (selectedFile.type.startsWith("image/"))
        setFormData((prev) => ({ ...prev, type: "image" }));
      else if (selectedFile.type.startsWith("video/"))
        setFormData((prev) => ({ ...prev, type: "video" }));
      else if (selectedFile.type.startsWith("audio/"))
        setFormData((prev) => ({ ...prev, type: "audio" }));
    }
  };

  const handleUploadFile = async () => {
    const fData = new FormData();

    // Append the image file (assuming 'imageFile' is a File object)
    fData.append("file", file);

    // Append any additional data (assuming 'data' is an object)
    Object.keys(formData).forEach((key) => {
      fData.append(key, formData[key]);
    });

    try {
      const url = `http://localhost:5000/api/assets/addAsset`;
      const res = await axios.post(`${url}/${user?.userId}`, fData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        // getInventoryItems();
        // setFormData({ itemName: "", itemType: "", image: null });
        // setSelectedImage(null);
        // setImageFile(null);
        // toast.success("Item Group Added");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !file) {
      setError("Please provide a name and select a file");
      return;
    } else {
      console.log("formData is", formData);
      console.log("file is", file);
      handleUploadFile();
    }

    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        size: file.size,
        thumbnail_url:
          formData.type === "image"
            ? URL.createObjectURL(file)
            : "https://via.placeholder.com/300",
        file_url: URL.createObjectURL(file),
      };

      await onUpload(payload);
      onClose();
    } catch (err) {
      setError("Failed to upload asset. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="bg-white dark:bg-[#111111] w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl relative animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-sora font-bold text-black dark:text-white">
                Upload Asset
              </h2>
              <p className="text-sm text-[#999999] mt-1">
                Add a new file to your creative studio
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#999999] hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] rounded-full transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Dropzone */}
            <div className="relative">
              {!file ? (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#DDDDDD] dark:border-[#333333] rounded-2xl cursor-pointer hover:border-black dark:hover:border-white hover:bg-[#F8F8F8] dark:hover:bg-[#1A1A1A] transition-all group">
                  <Upload
                    size={32}
                    className="text-[#999999] group-hover:text-black dark:group-hover:text-white mb-2"
                  />
                  <span className="text-sm font-semibold text-[#666666] dark:text-[#888888] group-hover:text-black dark:group-hover:text-white">
                    Click or drag to upload
                  </span>
                  <span className="text-xs text-[#999999] mt-1">
                    MP4, JPG, PNG, WAV or MP3
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              ) : (
                <div className="flex items-center gap-4 p-4 bg-[#F5F5F5] dark:bg-[#1A1A1A] rounded-2xl border border-[#EEEEEE] dark:border-[#222222]">
                  <div className="w-12 h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black">
                    <CheckCircle2 size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-black dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-[#999999]">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#999999] uppercase tracking-wider mb-2">
                  Asset Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hero Section Banner"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full h-11 px-4 bg-[#F8F8F8] dark:bg-[#1A1A1A] border border-[#EEEEEE] dark:border-[#333333] focus:border-black dark:focus:border-white rounded-xl text-sm font-inter transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#999999] uppercase tracking-wider mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full h-11 px-4 bg-[#F8F8F8] dark:bg-[#1A1A1A] border border-[#EEEEEE] dark:border-[#333333] focus:border-black dark:focus:border-white rounded-xl text-sm font-inter transition-all outline-none appearance-none"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="document">Document</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#999999] uppercase tracking-wider mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. web, design, q1"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    className="w-full h-11 px-4 bg-[#F8F8F8] dark:bg-[#1A1A1A] border border-[#EEEEEE] dark:border-[#333333] focus:border-black dark:focus:border-white rounded-xl text-sm font-inter transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-12 border border-[#EEEEEE] dark:border-[#333333] text-black dark:text-white rounded-xl font-bold text-sm hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-12 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/10"
              >
                {isSubmitting ? "Uploading..." : "Save Asset"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
