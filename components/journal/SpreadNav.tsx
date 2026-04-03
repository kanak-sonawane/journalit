"use client";

import { useJournalStore } from "@/store/journalStore";
import { Plus } from "lucide-react";

export default function SpreadNav() {
  const { spreads, currentSpreadIndex, goToSpread, addSpread } = useJournalStore();

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl"
      style={{
        background: "white",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <span className="text-xs opacity-40 mr-1" style={{ fontFamily: "var(--font-nunito)" }}>Spreads</span>

      {spreads.map((_, i) => (
        <button
          key={i}
          onClick={() => goToSpread(i)}
          className="w-8 h-8 rounded-lg text-xs transition-all flex items-center justify-center"
          style={{
            fontFamily: "var(--font-nunito)",
            background: currentSpreadIndex === i ? "#C9603C" : "#f5f5f5",
            color: currentSpreadIndex === i ? "white" : "#888",
            fontWeight: currentSpreadIndex === i ? 700 : 400,
          }}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={addSpread}
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
        style={{ background: "#f5f5f5", color: "#aaa" }}
        title="Add spread"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}