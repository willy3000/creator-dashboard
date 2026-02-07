import { useState } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function Sidebar({ onClose }) {
  const [activeItem, setActiveItem] = useState("All Assets");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user } = useSelector((state) => state.user);
  const router = useRouter();

  const navigationItems = [
    { name: "All Assets", icon: FolderOpen },
    { name: "Images", icon: ImageIcon },
    { name: "Videos", icon: Video },
    { name: "Audio", icon: Music },
    { name: "Documents", icon: FileText },
  ];

  const handleLogOut = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="w-64 bg-white dark:bg-[#111111] border-r border-[#EEEEEE] dark:border-[#222222] flex flex-col h-full">
      {/* Brand Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
          <FolderOpen size={18} className="text-white dark:text-black" />
        </div>
        <span className="font-sora font-bold text-lg text-black dark:text-white">
          Digital Realm
        </span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-2">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;

            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveItem(item.name);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-[#F5F5F5] dark:bg-[#1E1E1E] text-black dark:text-white font-medium"
                    : "text-[#666666] dark:text-[#888888] hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] hover:text-black dark:hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-inter">{item.name}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 pt-8 border-t border-[#EEEEEE] dark:border-[#222222]">
          <span className="px-4 text-[10px] font-bold text-[#999999] uppercase tracking-widest mb-4 block">
            Organization
          </span>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#666666] dark:text-[#888888] hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] transition-all">
            <Settings size={20} />
            <span className="text-sm font-inter">Settings</span>
          </button>
        </div>
      </nav>

      {/* User Area */}
      <div className="p-4 border-t border-[#EEEEEE] dark:border-[#222222]">
        <button
          className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all group ${
            isLoggingOut
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-[#F5F5F5] dark:hover:bg-[#1E1E1E]"
          }`}
          onClick={handleLogOut}
          disabled={isLoggingOut}
        >
          <div className="w-8 h-8 rounded-full bg-[#E5E5E5] dark:bg-[#2A2A2A] flex items-center justify-center">
            <User className="w-4 h-4 text-black dark:text-white" />
            {/* <img
              src=""
              className="w-8 h-8 rounded-full object-cover"
              alt="User"
            /> */}
          </div>

          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-black dark:text-white leading-none mb-1">
              {user?.username || "Guest"}
            </p>
            <p className="text-[11px] text-[#999999]">
              {isLoggingOut ? "Logging out..." : "creator"}
            </p>
          </div>
          {isLoggingOut ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#999999] border-t-transparent" />
          ) : (
            <LogOut
              size={16}
              className="text-[#999999] group-hover:text-red-500 transition-colors"
            />
          )}
        </button>
      </div>
    </div>
  );
}
