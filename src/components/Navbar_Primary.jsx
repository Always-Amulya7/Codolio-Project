import React, { useState } from "react";
import {
  FiStar,
  FiBell,
  FiMenu,
  FiUser,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";
const Navbar_Primary = ({ sheet }) => {
  const [openProfile, setOpenProfile] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br rounded-lg flex items-center justify-center text-white font-bold shadow-md">
              <img
                src="/favicon.jpg"
                alt="Codolio Demo Logo"
                className="rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                Codolio | Demo Project
              </h1>
              <p className="text-xs text-gray-500">
                Working Project Prototype - 2k26
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <FiStar className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              <FiBell className="w-5 h-5 text-gray-600" />
            </button>
            <div className="relative">
              <button
                onClick={() => setOpenProfile(!openProfile)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <img
                  src="https://api.dicebear.com/7.x/initials/svg?seed=A"
                  className="w-8 h-8 rounded-full"
                  alt="profile"
                />
              </button>
              {openProfile && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 text-sm">
                  <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50">
                    <FiUser /> Profile
                  </button>
                  <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50">
                    <FiSettings /> Settings
                  </button>
                  <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 text-red-500">
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setOpenMobile(!openMobile)}
            className="md:hidden"
          >
            <FiMenu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        {openMobile && (
          <div className="md:hidden mt-4 border-t pt-3 space-y-2 text-sm">
            <button className="flex items-center gap-2 w-full px-2 py-2 hover:bg-gray-50 rounded">
              <FiStar /> Favorites
            </button>
            <button className="flex items-center gap-2 w-full px-2 py-2 hover:bg-gray-50 rounded">
              <FiBell /> Notifications
            </button>
            <button className="flex items-center gap-2 w-full px-2 py-2 hover:bg-gray-50 rounded">
              <FiUser /> Profile
            </button>
            <button className="flex items-center gap-2 w-full px-2 py-2 hover:bg-gray-50 rounded">
              <FiSettings /> Settings
            </button>
            <button className="flex items-center gap-2 w-full px-2 py-2 text-red-500 hover:bg-gray-50 rounded">
              <FiLogOut /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
export default Navbar_Primary;
