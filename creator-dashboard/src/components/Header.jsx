import { useState } from "react";
import { Search, Bell, Plus, Menu, User } from "lucide-react";

export default function Header({ onMenuClick, onUploadClick, onSearch }) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    onSearch(val);
  };

  return (
    <header className="h-16 bg-white dark:bg-[#111111] border-b border-[#EEEEEE] dark:border-[#222222] flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-[#F5F5F5] dark:hover:bg-[#1E1E1E] rounded-lg transition-all"
        >
          <Menu size={20} className="text-[#666666] dark:text-[#888888]" />
        </button>

        <div className="relative max-w-md w-full hidden sm:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]"
          />
          <input
            type="text"
            placeholder="Search assets, tags, or names..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full h-10 pl-10 pr-4 bg-[#F8F8F8] dark:bg-[#1A1A1A] border border-transparent focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-black rounded-xl text-sm font-inter transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={onUploadClick}
          className="h-10 px-4 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center gap-2 text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm"
        >
          <Plus size={18} />
          <span className="hidden xs:inline">Upload Asset</span>
        </button>

        <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#EEEEEE] dark:border-[#333333] hover:bg-[#F5F5F5] dark:hover:bg-[#1E1E1E] transition-all relative">
          <Bell size={18} className="text-[#666666] dark:text-[#888888]" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#111111]"></span>
        </button>

        <div className="h-8 w-px bg-[#EEEEEE] dark:bg-[#222222] mx-1 hidden sm:block"></div>

        <button className="hidden sm:flex items-center gap-2 p-1 pl-2 rounded-xl border border-transparent hover:border-[#EEEEEE] dark:hover:border-[#333333] hover:bg-[#F5F5F5] dark:hover:bg-[#1E1E1E] transition-all">
          <span className="text-sm font-semibold text-black dark:text-white">
            Alex
          </span>

          <div className="w-8 h-8 rounded-full bg-[#E5E5E5] dark:bg-[#2A2A2A] flex items-center justify-center">
            <User className="w-4 h-4 text-black dark:text-white" />
            {/* <img
              src=""
              className="w-8 h-8 rounded-full object-cover"
              alt="User"
            /> */}
          </div>
        </button>
      </div>
    </header>
  );
}
