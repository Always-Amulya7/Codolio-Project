import React, { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import QuestionItem from "./QuestionItem";
import useStore from "./useStore";
const SubTopicItem = ({ subTopic, index, topicId, isExpanded, onToggle }) => {
  const { addQuestion, updateSubTopic, deleteSubTopic, reorderQuestions } =
    useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editTitle, setEditTitle] = useState(subTopic.title);
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionUrl, setNewQuestionUrl] = useState("");
  const [newQuestionDifficulty, setNewQuestionDifficulty] = useState("Easy");
  const handleSave = () => {
    updateSubTopic(topicId, subTopic.id, editTitle);
    setIsEditing(false);
  };
  const handleCancel = () => {
    setEditTitle(subTopic.title);
    setIsEditing(false);
  };
  const handleAddQuestion = () => {
    if (newQuestionTitle.trim()) {
      addQuestion(topicId, subTopic.id, {
        title: newQuestionTitle,
        url: newQuestionUrl || "#",
        difficulty: newQuestionDifficulty,
      });
      setNewQuestionTitle("");
      setNewQuestionUrl("");
      setNewQuestionDifficulty("Easy");
      setIsAddingQuestion(false);
    }
  };
  const questionCount = subTopic.questions?.length || 0;
  return (
    <Draggable draggableId={subTopic.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-gray-50 rounded-lg border border-gray-200 overflow-hidden transition-shadow ${
            snapshot.isDragging ? "shadow-lg ring-2 ring-blue-500" : ""
          }`}
        >
          <div
            className="flex items-center justify-between p-4 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={onToggle}
          >
            <div className="flex items-center gap-3">
              <div
                {...provided.dragHandleProps}
                className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
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
                    d="M4 8h16M4 16h16"
                  />
                </svg>
              </div>
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <h3 className="font-semibold text-gray-900">
                    {subTopic.title}
                  </h3>
                )}
                <p className="text-sm text-gray-500">
                  {questionCount} question{questionCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {isEditing ? (
                <>
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
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsAddingQuestion(true)}
                    className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                    title="Add Question"
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
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                    title="Edit"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteSubTopic(topicId, subTopic.id)}
                    className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                    title="Delete"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </>
              )}
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          {isExpanded && (
            <div className="p-4 border-t border-gray-200">
              {isAddingQuestion && (
                <div className="mb-4 p-4 bg-white rounded-lg border border-blue-200">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Add New Question
                  </h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newQuestionTitle}
                      onChange={(e) => setNewQuestionTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Question title"
                    />
                    <input
                      type="text"
                      value={newQuestionUrl}
                      onChange={(e) => setNewQuestionUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Question URL (optional)"
                    />
                    <select
                      value={newQuestionDifficulty}
                      onChange={(e) => setNewQuestionDifficulty(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddQuestion}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Add Question
                      </button>
                      <button
                        onClick={() => setIsAddingQuestion(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {subTopic.questions && subTopic.questions.length > 0 ? (
                <Droppable droppableId={subTopic.id} type="question">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[100px] rounded-lg transition-colors ${
                        snapshot.isDraggingOver ? "bg-blue-50" : ""
                      }`}
                    >
                      {subTopic.questions.map((question, idx) => (
                        <QuestionItem
                          key={question.id}
                          question={question}
                          index={idx}
                          topicId={topicId}
                          subTopicId={subTopic.id}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg
                    className="w-12 h-12 mx-auto mb-2 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p>No questions yet. Click "+" to add a question.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};
export default SubTopicItem;
