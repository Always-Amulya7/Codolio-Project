import React, { useEffect, useState, useCallback } from "react";
import TopicList from "./pages/TopicList";
import useStore from "./pages/useStore";
import Navbar from "./components/Navbar_Secondary";
import Navbar_Primary from "./components/Navbar_Primary";
import Calender from "./components/Calender";
import SortFunc from "./components/SortFunc";
import Footer from "./components/Footer";
const App = () => {
  const { loadData, sheet } = useStore();
  const [sortBy, setSortBy] = useState("all");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  useEffect(() => {
    loadData();
  }, [loadData]);
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const totalQuestions =
    sheet.topics?.reduce(
      (acc, topic) =>
        acc +
        (topic.subTopics?.reduce(
          (stAcc, st) => stAcc + (st.questions?.length || 0),
          0,
        ) || 0),
      0,
    ) || 0;
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <Navbar_Primary
        sheet={sheet}
        totalQuestions={totalQuestions}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-gray-50 scrollbar-hide">
          <div className="w-full px-4 md:px-6 py-6">
            <div className="rounded-[50px] border-2 shadow-sm overflow-hidden">
              <Navbar
                sheet={sheet}
                totalQuestions={totalQuestions}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
                onAddTopic={() => setIsAddingTopic(true)}
              />
            </div>
            <br></br>
            <TopicList
              sortBy={sortBy}
              searchQuery={searchQuery}
              isAddingTopic={isAddingTopic}
              setIsAddingTopic={setIsAddingTopic}
            />
          </div>
        </div>
        <div className="hidden lg:flex w-80 mt-2 border-gray-200 flex-col flex-shrink-0 overflow-hidden">
          <div className="p-4 space-y-4 overflow-hidden">
            <Calender
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
            />
            <SortFunc
              sortBy={sortBy}
              setSortBy={setSortBy}
              sheet={sheet}
              totalQuestions={totalQuestions}
            />
          </div>
        </div>
      </div>
      <Footer sheet={sheet} totalQuestions={totalQuestions} />
      <div className="lg:hidden fixed bottom-6 mb-8 right-6 flex flex-col gap-3 z-40">
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="w-12 h-12 bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-700 transition-all transform hover:scale-105"
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
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        )}
        <button
          onClick={() => setShowSort(!showSort)}
          className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center hover:from-indigo-600 hover:to-indigo-800 transition-all transform hover:scale-105"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>
        </button>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full shadow-lg flex items-center justify-center hover:from-blue-600 hover:to-blue-800 transition-all transform hover:scale-105"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>
      {showSort && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowSort(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Filter by Difficulty
              </h3>
              <button
                onClick={() => setShowSort(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
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
            </div>
            <div className="p-4 space-y-3">
              <button
                onClick={() => {
                  setSortBy("all");
                  setShowSort(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-xl border-2 transition-all ${sortBy === "all" ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-700 border-gray-200"}`}
              >
                <span className="font-semibold">All</span>
                <span className="text-sm opacity-80">{totalQuestions}</span>
              </button>
              <button
                onClick={() => {
                  setSortBy("easy");
                  setShowSort(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-xl border-2 transition-all ${sortBy === "easy" ? "bg-green-600 text-white border-green-600" : "bg-white text-green-700 border-green-200"}`}
              >
                <span className="font-semibold">Easy</span>
                <span className="text-sm opacity-80">0</span>
              </button>
              <button
                onClick={() => {
                  setSortBy("medium");
                  setShowSort(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-xl border-2 transition-all ${sortBy === "medium" ? "bg-yellow-500 text-white border-yellow-500" : "bg-white text-yellow-700 border-yellow-200"}`}
              >
                <span className="font-semibold">Medium</span>
                <span className="text-sm opacity-80">0</span>
              </button>
              <button
                onClick={() => {
                  setSortBy("hard");
                  setShowSort(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-xl border-2 transition-all ${sortBy === "hard" ? "bg-red-600 text-white border-red-600" : "bg-white text-red-700 border-red-200"}`}
              >
                <span className="font-semibold">Hard</span>
                <span className="text-sm opacity-80">0</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {showCalendar && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowCalendar(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Calendar</h3>
              <button
                onClick={() => setShowCalendar(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
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
            </div>
            <div className="p-4">
              <Calender
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default App;
