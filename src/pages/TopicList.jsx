import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import TopicItem from "./TopicItem";
import useStore from "./useStore";
const TopicList = ({
  sortBy = "all",
  searchQuery = "",
  isAddingTopic,
  setIsAddingTopic,
}) => {
  const { sheet, addTopic, reorderTopics } = useStore();
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [expandedTopics, setExpandedTopics] = useState({});
  useEffect(() => {
    if (searchQuery.trim()) {
      const allExpanded = {};
      sheet.topics?.forEach((topic) => {
        allExpanded[topic.id] = true;
      });
      setExpandedTopics(allExpanded);
    }
  }, [searchQuery, sheet.topics]);
  const toggleTopic = (topicId) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };
  const handleAddTopic = () => {
    if (newTopicTitle.trim()) {
      const newTopicId = addTopic(newTopicTitle);
      setNewTopicTitle("");
      setIsAddingTopic(false);
      setExpandedTopics((prev) => ({
        ...prev,
        [newTopicId]: true,
      }));
    }
  };
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, type } = result;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    if (type === "topic") {
      const items = Array.from(sheet.topics);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      reorderTopics(items);
    }
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
  const getFilteredTopics = () => {
    let filtered =
      sheet.topics
        ?.map((topic) => ({
          ...topic,
          subTopics: topic.subTopics
            ?.map((subTopic) => {
              const filteredQuestions =
                sortBy === "all"
                  ? subTopic.questions
                  : subTopic.questions?.filter(
                      (q) => q.difficulty.toLowerCase() === sortBy,
                    ) || [];
              return {
                ...subTopic,
                questions: filteredQuestions,
              };
            })
            .filter((st) => {
              if (searchQuery.trim()) {
                return st.questions && st.questions.length > 0;
              }
              return true;
            }),
        }))
        .filter((topic) => {
          if (searchQuery.trim()) {
            return topic.subTopics && topic.subTopics.length > 0;
          }
          return true;
        }) || [];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (topic) =>
          topic.title.toLowerCase().includes(query) ||
          topic.subTopics?.some(
            (st) =>
              st.title.toLowerCase().includes(query) ||
              st.questions?.some((q) => q.title.toLowerCase().includes(query)),
          ),
      );
    }
    return filtered;
  };
  const filteredTopics = getFilteredTopics();
  return (
    <div className="w-full">
      {isAddingTopic && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <h3 className="font-medium text-gray-900 mb-3">Add New Topic</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Topic title"
              onKeyPress={(e) => e.key === "Enter" && handleAddTopic()}
            />
            <button
              onClick={handleAddTopic}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => setIsAddingTopic(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="topics" type="topic">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`space-y-4 ${snapshot.isDraggingOver ? "bg-blue-50 rounded-xl p-4" : ""}`}
            >
              {filteredTopics && filteredTopics.length > 0 ? (
                filteredTopics.map((topic, index) => (
                  <TopicItem
                    key={topic.id}
                    topic={topic}
                    index={index}
                    isExpanded={expandedTopics[topic.id] === true}
                    onToggle={() => toggleTopic(topic.id)}
                  />
                ))
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                  <svg
                    className="w-20 h-20 mx-auto mb-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchQuery
                      ? "No results found"
                      : sortBy === "all"
                        ? "No topics yet"
                        : `No ${sortBy} questions found`}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery
                      ? `No topics or questions match "${searchQuery}"`
                      : sortBy === "all"
                        ? "Get started by adding your first topic"
                        : `There are no ${sortBy} difficulty questions in the current sheet.`}
                  </p>
                  {sortBy === "all" && !searchQuery && (
                    <button
                      onClick={() => setIsAddingTopic(true)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
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
                      Add First Topic
                    </button>
                  )}
                  {searchQuery && (
                    <button
                      onClick={() => {}}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium inline-flex items-center gap-2"
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
                      Clear Search
                    </button>
                  )}
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
export default TopicList;
