import React from "react";
const Calender = ({ currentDate, setCurrentDate, isCompact = false }) => {
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay, year, month };
  };
  const { days, firstDay, year, month } = getDaysInMonth(currentDate);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${isCompact ? "text-xs" : "text-sm"}`}
    >
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-base">
            {monthNames[month]} {year}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-white/20 text-white transition-colors"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-white/20 text-white transition-colors"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-3">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2"></div>
          ))}
          {Array.from({ length: days }).map((_, i) => {
            const day = i + 1;
            const isToday =
              day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();
            return (
              <div
                key={day}
                className={`p-2 text-center rounded-lg cursor-pointer transition-all font-medium ${
                  isToday
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Calender;
