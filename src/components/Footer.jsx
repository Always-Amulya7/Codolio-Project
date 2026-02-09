import React from "react";
const Footer = ({ sheet, totalQuestions }) => {
  const totalSections = sheet?.topics?.length || 0;
  return (
    <footer className="bg-white border-t border-gray-200 py-[10px] px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm text-gray-500">
        <div className="text-left">
          <span className="font-medium text-gray-700">
            {totalSections} Sections | {totalQuestions} Questions
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1 text-left md:text-right">
          <span>Copyright &copy; 2026 By</span>
          <a
            href="https://www.linkedin.com/in/amulya-shrivastava-11a0a9288/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:underline font-medium"
          >
            Amulya Shrivastava
          </a>
          <span className="hidden md:inline">|</span>
          <span>Made With ❤️ For Codolio !!</span>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
