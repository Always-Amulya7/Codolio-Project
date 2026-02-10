import React, { useState, useEffect } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import SubTopicItem from "./SubTopicItem";
import useStore from "./useStore";
const TopicItem = ({
  topic,
  index,
  isExpanded,
  onToggle,
  searchQuery = "",
}) => {
  const { addSubTopic, updateTopic, deleteTopic, reorderSubTopics } =
    useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingSubTopic, setIsAddingSubTopic] = useState(false);
  const [editTitle, setEditTitle] = useState(topic.title);
  const [newSubTopicTitle, setNewSubTopicTitle] = useState("");
  const [expandedSubTopics, setExpandedSubTopics] = useState({});
  useEffect(() => {
    if (searchQuery.trim() && topic.subTopics) {
      const allExpanded = {};
      topic.subTopics.forEach((st) => {
        allExpanded[st.id] = true;
      });
      setExpandedSubTopics(allExpanded);
    } else if (!searchQuery.trim()) {
      setExpandedSubTopics({});
    }
  }, [searchQuery, topic.subTopics]);
  const toggleSubTopic = (subTopicId) => {
    setExpandedSubTopics((prev) => ({
      ...prev,
      [subTopicId]: !prev[subTopicId],
    }));
  };
  const handleSave = () => {
    updateTopic(topic.id, editTitle);
    setIsEditing(false);
  };
  const handleCancel = () => {
    setEditTitle(topic.title);
    setIsEditing(false);
  };
  const handleAddSubTopicClick = () => {
    if (!isExpanded) {
      onToggle();
    }
    setIsAddingSubTopic(true);
  };
  const handleAddSubTopic = () => {
    if (newSubTopicTitle.trim()) {
      addSubTopic(topic.id, newSubTopicTitle);
      setNewSubTopicTitle("");
      setIsAddingSubTopic(false);
    }
  };
  const questionCount =
    topic.subTopics?.reduce(
      (acc, st) => acc + (st.questions?.length || 0),
      0,
    ) || 0;
  return (
    <Draggable draggableId={topic.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-shadow ${
            snapshot.isDragging ? "shadow-lg ring-2 ring-blue-500" : ""
          }`}
        >
          <div
            className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-600 to-blue-700 cursor-pointer hover:from-blue-700 hover:to-blue-800 transition-colors"
            onClick={onToggle}
          >
            <div className="flex items-center gap-4">
              <div
                {...provided.dragHandleProps}
                className="cursor-grab active:cursor-grabbing p-2 text-blue-200 hover:text-white transition-colors"
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
                    className="px-3 py-2 border border-white/30 bg-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-blue-200"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-white">
                    {topic.title}
                  </h2>
                )}
                <p className="text-blue-200 text-sm">
                  {topic.subTopics?.length || 0} sub-topic
                  {topic.subTopics?.length !== 1 ? "s" : ""} • {questionCount}{" "}
                  question{questionCount !== 1 ? "s" : ""}
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
                    className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-blue-800 text-blue-200 rounded-md hover:bg-blue-900 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleAddSubTopicClick}
                    className="p-2 text-blue-200 hover:bg-white/10 rounded-lg transition-colors"
                    title="Add Sub-topic"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-blue-200 hover:bg-white/10 rounded-lg transition-colors"
                    title="Edit"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteTopic(topic.id)}
                    className="p-2 text-blue-200 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors"
                    title="Delete"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </>
              )}
              <svg
                className={`w-6 h-6 text-blue-200 transition-transform ${isExpanded ? "rotate-180" : ""}`}
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
            <div className="p-5 border-t border-gray-200">
              {isAddingSubTopic && (
                <div className="mb-5 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Add New Sub-topic
                  </h4>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newSubTopicTitle}
                      onChange={(e) => setNewSubTopicTitle(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Sub-topic title"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddSubTopic()
                      }
                    />
                    <button
                      onClick={handleAddSubTopic}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setIsAddingSubTopic(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {topic.subTopics && topic.subTopics.length > 0 ? (
                <Droppable droppableId={topic.id} type="subtopic">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-4 min-h-[100px] rounded-lg transition-colors ${
                        snapshot.isDraggingOver ? "bg-blue-50" : ""
                      }`}
                    >
                      {topic.subTopics.map((subTopic, idx) => (
                        <SubTopicItem
                          key={subTopic.id}
                          subTopic={subTopic}
                          index={idx}
                          topicId={topic.id}
                          isExpanded={expandedSubTopics[subTopic.id] === true}
                          onToggle={() => toggleSubTopic(subTopic.id)}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <svg
                    className="w-16 h-16 mx-auto mb-3 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-gray-500 mb-2">No sub-topics yet</p>
                  <p className="text-gray-400 text-sm">
                    Click the "+" button above to add your first sub-topic
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};
export default TopicItem;
