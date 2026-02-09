import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import useStore from "./useStore";
const difficultyColors = {
  Easy: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Hard: "bg-red-100 text-red-800",
};
const QuestionItem = ({ question, index, topicId, subTopicId }) => {
  const { updateQuestion, deleteQuestion } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(question.title);
  const [editUrl, setEditUrl] = useState(question.url);
  const [editDifficulty, setEditDifficulty] = useState(question.difficulty);
  const handleSave = () => {
    updateQuestion(topicId, subTopicId, question.id, {
      title: editTitle,
      url: editUrl,
      difficulty: editDifficulty,
    });
    setIsEditing(false);
  };
  const handleCancel = () => {
    setEditTitle(question.title);
    setEditUrl(question.url);
    setEditDifficulty(question.difficulty);
    setIsEditing(false);
  };
  return (
    <Draggable draggableId={question.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg border border-gray-200 p-4 mb-3 transition-shadow hover:shadow-md ${
            snapshot.isDragging ? "shadow-lg ring-2 ring-blue-500" : ""
          }`}
        >
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Question title"
              />
              <input
                type="text"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Question URL"
              />
              <select
                value={editDifficulty}
                onChange={(e) => setEditDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {question.title}
                  </h4>
                  {question.url && question.url !== "#" && (
                    <a
                      href={question.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      View Problem
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[question.difficulty]}`}
                  >
                    {question.difficulty}
                  </span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                    title="Edit"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      deleteQuestion(topicId, subTopicId, question.id)
                    }
                    className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
};
export default QuestionItem;
