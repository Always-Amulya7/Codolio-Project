import React, { useState } from "react";
const Navbar = ({
  sheet,
  totalQuestions,
  searchQuery,
  setSearchQuery,
  onSearch,
  onAddTopic,
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    setSearchQuery(value);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch(localSearch);
    }
  };
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="px-4 md:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-3">
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                {sheet.name || "Question Tracker"}
              </h1>
              <p className="text-xs text-gray-500 truncate max-w-[300px]">
                {sheet.description || "Track your coding progress"}
              </p>
            </div>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
              QT
            </div>
            <h1 className="text-base font-bold text-gray-900">
              {sheet.name || "Tracker"}
            </h1>
          </div>
          <div className="flex-1 max-w-lg ml-auto">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search topics, questions..."
                value={localSearch}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
              />
              {localSearch && (
                <button
                  onClick={() => {
                    setLocalSearch("");
                    setSearchQuery("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <button
            onClick={onAddTopic}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-[50px] hover:bg-blue-700 transition-colors shadow-md"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
