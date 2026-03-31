import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Spread, Page, JournalElement, ActiveTool, PageType } from "@/lib/types";
import { DEFAULT_PAGE_COLOR } from "@/lib/constants";
import { nanoid } from "nanoid";

const createPage = (): Page => ({
  id: nanoid(),
  pageType: "blank",
  bgColor: DEFAULT_PAGE_COLOR,
  elements: [],
});

const createSpread = (): Spread => ({
  id: nanoid(),
  left: createPage(),
  right: createPage(),
});

interface JournalState {
  spreads: Spread[];
  currentSpreadIndex: number;
  activeTool: ActiveTool;
  selectedElementId: string | null;
  activePageSide: "left" | "right";

  // Spread actions
  addSpread: () => void;
  goToSpread: (index: number) => void;

  // Page actions
  setPageType: (side: "left" | "right", pageType: PageType) => void;
  setPageColor: (side: "left" | "right", color: string) => void;

  // Element actions
  addElement: (side: "left" | "right", element: JournalElement) => void;
  updateElement: (side: "left" | "right", id: string, updates: Partial<JournalElement>) => void;
  deleteElement: (side: "left" | "right", id: string) => void;

  // UI actions
  setActiveTool: (tool: ActiveTool) => void;
  setSelectedElement: (id: string | null) => void;
  setActivePageSide: (side: "left" | "right") => void;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      spreads: [createSpread()],
      currentSpreadIndex: 0,
      activeTool: "select",
      selectedElementId: null,
      activePageSide: "left",

      addSpread: () => set((s) => ({ spreads: [...s.spreads, createSpread()] })),

      goToSpread: (index) => set({ currentSpreadIndex: index, selectedElementId: null }),

      setPageType: (side, pageType) =>
        set((s) => {
          const spreads = [...s.spreads];
          spreads[s.currentSpreadIndex] = {
            ...spreads[s.currentSpreadIndex],
            [side]: { ...spreads[s.currentSpreadIndex][side], pageType },
          };
          return { spreads };
        }),

      setPageColor: (side, color) =>
        set((s) => {
          const spreads = [...s.spreads];
          spreads[s.currentSpreadIndex] = {
            ...spreads[s.currentSpreadIndex],
            [side]: { ...spreads[s.currentSpreadIndex][side], bgColor: color },
          };
          return { spreads };
        }),

      addElement: (side, element) =>
        set((s) => {
          const spreads = [...s.spreads];
          const page = spreads[s.currentSpreadIndex][side];
          spreads[s.currentSpreadIndex] = {
            ...spreads[s.currentSpreadIndex],
            [side]: { ...page, elements: [...page.elements, element] },
          };
          return { spreads };
        }),

      updateElement: (side, id, updates) =>
        set((s) => {
          const spreads = [...s.spreads];
          const page = spreads[s.currentSpreadIndex][side];
          spreads[s.currentSpreadIndex] = {
            ...spreads[s.currentSpreadIndex],
            [side]: {
              ...page,
              elements: page.elements.map((el) =>
                el.id === id ? ({ ...el, ...updates } as JournalElement) : el
              ),
            },
          };
          return { spreads };
        }),

      deleteElement: (side, id) =>
        set((s) => {
          const spreads = [...s.spreads];
          const page = spreads[s.currentSpreadIndex][side];
          spreads[s.currentSpreadIndex] = {
            ...spreads[s.currentSpreadIndex],
            [side]: { ...page, elements: page.elements.filter((el) => el.id !== id) },
          };
          return { spreads };
        }),

      setActiveTool: (tool) => set({ activeTool: tool }),
      setSelectedElement: (id) => set({ selectedElementId: id }),
      setActivePageSide: (side) => set({ activePageSide: side }),
    }),
    { name: "scrappy-journal" }
  )
);