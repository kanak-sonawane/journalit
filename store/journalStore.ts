import { create } from "zustand";
import { Spread, Page, JournalElement, ActiveTool, PageType } from "@/lib/types";
import { DEFAULT_PAGE_COLOR } from "@/lib/constants";
import { nanoid } from "nanoid";

// Global image storage — never goes to localStorage
export const imageStore: Record<string, string> = {};

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
  selectedElementSide: "left" | "right" | null;
  activePageSide: "left" | "right";

  addSpread: () => void;
  goToSpread: (index: number) => void;
  setPageType: (side: "left" | "right", pageType: PageType) => void;
  setPageColor: (side: "left" | "right", color: string) => void;
  addElement: (side: "left" | "right", element: JournalElement) => void;
  updateElement: (side: "left" | "right", id: string, updates: Partial<JournalElement>) => void;
  deleteElement: (side: "left" | "right", id: string) => void;
  setActiveTool: (tool: ActiveTool) => void;
  setSelectedElement: (id: string | null, side?: "left" | "right") => void;
  setActivePageSide: (side: "left" | "right") => void;
}

export const useJournalStore = create<JournalState>()((set) => ({
  spreads: [createSpread()],
  currentSpreadIndex: 0,
  activeTool: "select",
  selectedElementId: null,
  selectedElementSide: null,
  activePageSide: "left",

  addSpread: () =>
    set((s) => ({ spreads: [...s.spreads, createSpread()] })),

  goToSpread: (index) =>
    set({ currentSpreadIndex: index, selectedElementId: null }),

  setPageType: (side, pageType) =>
    set((s) => ({
      spreads: s.spreads.map((sp, i) =>
        i !== s.currentSpreadIndex ? sp
          : { ...sp, [side]: { ...sp[side], pageType } }
      ),
    })),

  setPageColor: (side, color) =>
    set((s) => ({
      spreads: s.spreads.map((sp, i) =>
        i !== s.currentSpreadIndex ? sp
          : { ...sp, [side]: { ...sp[side], bgColor: color } }
      ),
    })),

  addElement: (side, element) =>
    set((s) => ({
      spreads: s.spreads.map((sp, i) =>
        i !== s.currentSpreadIndex ? sp
          : { ...sp, [side]: { ...sp[side], elements: [...sp[side].elements, element] } }
      ),
    })),

  updateElement: (side, id, updates) =>
    set((s) => ({
      spreads: s.spreads.map((sp, i) =>
        i !== s.currentSpreadIndex ? sp
          : {
              ...sp,
              [side]: {
                ...sp[side],
                elements: sp[side].elements.map((el) =>
                  el.id === id ? ({ ...el, ...updates } as JournalElement) : el
                ),
              },
            }
      ),
    })),

  deleteElement: (side, id) =>
    set((s) => ({
      spreads: s.spreads.map((sp, i) =>
        i !== s.currentSpreadIndex ? sp
          : { ...sp, [side]: { ...sp[side], elements: sp[side].elements.filter((el) => el.id !== id) } }
      ),
    })),

  setActiveTool: (tool) => set({ activeTool: tool }),

  setSelectedElement: (id, side) =>
    set({ selectedElementId: id, selectedElementSide: side ?? null }),

  setActivePageSide: (side) => set({ activePageSide: side }),
}));