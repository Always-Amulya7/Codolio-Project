import React from "react";
const SortFunc = ({
  sortBy,
  setSortBy,
  sheet,
  totalQuestions,
  isCompact = false,
}) => {
  const count = (level) =>
    sheet.topics?.reduce(
      (acc, topic) =>
        acc +
        (topic.subTopics?.reduce(
          (stAcc, st) =>
            stAcc +
            (st.questions?.filter((q) => q.difficulty === level).length || 0),
          0,
        ) || 0),
      0,
    ) || 0;
  const easy = count("Easy");
  const medium = count("Medium");
  const hard = count("Hard");
  const difficultyButtons = [
    { key: "all", label: "All", count: totalQuestions, color: "gray" },
    { key: "easy", label: "Easy", count: easy, color: "green" },
    { key: "medium", label: "Medium", count: medium, color: "yellow" },
    { key: "hard", label: "Hard", count: hard, color: "red" },
  ];
  const getColorClasses = (btnColor, isActive) => {
    const colors = {
      gray: isActive
        ? "bg-gray-800 text-white border-gray-800 shadow-md"
        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300",
      green: isActive
        ? "bg-green-600 text-white border-green-600 shadow-md"
        : "bg-white text-green-700 border-green-200 hover:bg-green-50 hover:border-green-300",
      yellow: isActive
        ? "bg-yellow-500 text-white border-yellow-500 shadow-md"
        : "bg-white text-yellow-700 border-yellow-200 hover:bg-yellow-50 hover:border-yellow-300",
      red: isActive
        ? "bg-red-600 text-white border-red-600 shadow-md"
        : "bg-white text-red-700 border-red-200 hover:bg-red-50 hover:border-red-300",
    };
    return colors[btnColor];
  };
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">
            Filter by Difficulty
          </h3>
        </div>
        <div className="p-4 space-y-2">
          {difficultyButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setSortBy(btn.key)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all duration-200 ${getColorClasses(
                btn.color,
                sortBy === btn.key,
              )}`}
            >
              <span className="font-semibold">{btn.label}</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  sortBy === btn.key
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {btn.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
export default SortFunc;
