import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import sheetJson from "./sheet.json";

const API_URL = "https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/striver-sde-sheet";

/**
 * Transform Codolio sheet.json into:
 * sheet -> topics -> subTopics(difficulty) -> questions
 */
function transformSheetData(apiData) {
  if (!apiData?.data?.sheet || !apiData?.data?.questions) {
    return {
      id: uuidv4(),
      name: "Sheet",
      description: "",
      topics: [],
    };
  }

  const { sheet, questions } = apiData.data;

  const topicOrder = sheet.config?.topicOrder || [];
  const questionOrder = sheet.config?.questionOrder || [];

  // Map topic -> difficulty -> questions
  const topicMap = new Map();

  questions.forEach((q) => {
    const topicName = q.topic || "General";
    const difficulty = q.questionId?.difficulty || "Easy";

    if (!topicMap.has(topicName)) {
      topicMap.set(topicName, {
        id: uuidv4(),
        title: topicName,
        subTopics: new Map(),
      });
    }

    const topic = topicMap.get(topicName);

    if (!topic.subTopics.has(difficulty)) {
      topic.subTopics.set(difficulty, {
        id: uuidv4(),
        title: difficulty,
        questions: [],
      });
    }

    const sub = topic.subTopics.get(difficulty);

    sub.questions.push({
      id: q._id,
      title: q.title || q.questionId?.name,
      difficulty,
      url: q.resource || q.questionId?.problemUrl || "#",
      isSolved: q.isSolved || false,
    });
  });

  // Convert maps → arrays
  let topics = Array.from(topicMap.values());

  // Sort topics by backend topicOrder
  topics.sort((a, b) => {
    const ai = topicOrder.indexOf(a.title);
    const bi = topicOrder.indexOf(b.title);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  topics.forEach((topic) => {
    topic.subTopics = Array.from(topic.subTopics.values());

    // Sort questions inside each subtopic by questionOrder
    topic.subTopics.forEach((st) => {
      st.questions.sort((a, b) => {
        const ai = questionOrder.indexOf(a.id);
        const bi = questionOrder.indexOf(b.id);
        if (ai === -1 && bi === -1) return 0;
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      });
    });
  });

  return {
    id: sheet._id || sheet.slug,
    name: sheet.name,
    description: sheet.description,
    link: sheet.link,
    topics,
  };
}

const initialSheet = transformSheetData(sheetJson);

const useStore = create(
  persist(
    (set, get) => ({
      sheet: initialSheet,

      loadData: async () => {
        // Only load from API if there's no persisted data
        const hasPersistedData = localStorage.getItem("codolio-sheet-storage") !== null;
        if (hasPersistedData) {
          return; // Skip loading, use persisted data
        }
        try {
          const response = await fetch(API_URL);
          if (!response.ok) throw new Error("API request failed");
          const apiData = await response.json();
          const transformedData = transformSheetData(apiData);
          set({ sheet: transformedData });
        } catch (error) {
          console.warn("Failed to load from API, falling back to local sheet.json:", error);
          // Already using initialSheet from sheet.json, no action needed
        }
      },

      /* ---------------- Topics ---------------- */

      addTopic: (title) => {
        const id = uuidv4();
        set((state) => ({
          sheet: {
            ...state.sheet,
            topics: [
              ...state.sheet.topics,
              {
                id,
                title,
                subTopics: [
                  { id: uuidv4(), title: "Easy", questions: [] },
                  { id: uuidv4(), title: "Medium", questions: [] },
                  { id: uuidv4(), title: "Hard", questions: [] },
                ],
              },
            ],
          },
        }));
        return id;
      },

      updateTopic: (topicId, title) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            topics: state.sheet.topics.map((t) =>
              t.id === topicId ? { ...t, title } : t,
            ),
          },
        })),

      deleteTopic: (topicId) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            topics: state.sheet.topics.filter((t) => t.id !== topicId),
          },
        })),

      reorderTopics: (topics) =>
        set((state) => ({
          sheet: { ...state.sheet, topics },
        })),

      /* ---------------- SubTopics ---------------- */

      addSubTopic: (topicId, title) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            topics: state.sheet.topics.map((t) =>
              t.id === topicId
                ? {
                    ...t,
                    subTopics: [...t.subTopics, { id: uuidv4(), title, questions: [] }],
                  }
                : t,
            ),
          },
        })),

      updateSubTopic: (topicId, subTopicId, title) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            topics: state.sheet.topics.map((t) =>
              t.id === topicId
                ? {
                    ...t,
                    subTopics: t.subTopics.map((s) =>
                      s.id === subTopicId ? { ...s, title } : s,
                    ),
                  }
                : t,
            ),
          },
        })),

      deleteSubTopic: (topicId, subTopicId) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            topics: state.sheet.topics.map((t) =>
              t.id === topicId
                ? {
                    ...t,
                    subTopics: t.subTopics.filter((s) => s.id !== subTopicId),
                  }
                : t,
            ),
          },
        })),

      reorderSubTopics: (topicId, subTopics) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            topics: state.sheet.topics.map((t) =>
              t.id === topicId ? { ...t, subTopics } : t,
            ),
          },
        })),

      /* ---------------- Questions ---------------- */

      addQuestion: (topicId, subTopicId, question) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            topics: state.sheet.topics.map((t) =>
              t.id === topicId
                ? {
                    ...t,
                    subTopics: t.subTopics.map((s) =>
                      s.id === subTopicId
                        ? {
                            ...s,
                            questions: [...s.questions, { id: uuidv4(), ...question }],
                          }
                        : s,
                    ),
                  }
                : t,
            ),
          },
        })),

      updateQuestion: (topicId, subTopicId, qid, updates) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            topics: state.sheet.topics.map((t) =>
              t.id === topicId
                ? {
                    ...t,
                    subTopics: t.subTopics.map((s) =>
                      s.id === subTopicId
                        ? {
                            ...s,
                            questions: s.questions.map((q) =>
                              q.id === qid ? { ...q, ...updates } : q,
                            ),
                          }
                        : s,
                    ),
                  }
                : t,
            ),
          },
        })),

      deleteQuestion: (topicId, subTopicId, qid) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            topics: state.sheet.topics.map((t) =>
              t.id === topicId
                ? {
                    ...t,
                    subTopics: t.subTopics.map((s) =>
                      s.id === subTopicId
                        ? {
                            ...s,
                            questions: s.questions.filter((q) => q.id !== qid),
                          }
                        : s,
                    ),
                  }
                : t,
            ),
          },
        })),

      reorderQuestions: (topicId, subTopicId, questions) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            topics: state.sheet.topics.map((t) =>
              t.id === topicId
                ? {
                    ...t,
                    subTopics: t.subTopics.map((s) =>
                      s.id === subTopicId ? { ...s, questions } : s,
                    ),
                  }
                : t,
            ),
          },
        })),

      toggleSolved: (topicId, subTopicId, qid) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            topics: state.sheet.topics.map((t) =>
              t.id === topicId
                ? {
                    ...t,
                    subTopics: t.subTopics.map((s) =>
                      s.id === subTopicId
                        ? {
                            ...s,
                            questions: s.questions.map((q) =>
                              q.id === qid ? { ...q, isSolved: !q.isSolved } : q,
                            ),
                          }
                        : s,
                    ),
                  }
                : t,
            ),
          },
        })),
    }),
    {
      name: "codolio-sheet-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useStore;
