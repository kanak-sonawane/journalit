"use client";

import { useJournalStore } from "@/store/journalStore";
import BinderRings from "./BinderRings";
import PageCanvas from "./PageCanvas";

export default function BinderSpread() {
  const { spreads, currentSpreadIndex } = useJournalStore();
  const spread = spreads[currentSpreadIndex];

  return (
    <div
      className="relative flex"
      style={{
        maxWidth: 1100,
        width: "100%",
        height: "75vh",
        minHeight: 520,
        borderRadius: 12,
        boxShadow: "0 24px 64px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.1)",
        overflow: "visible",
      }}
    >
      {/* Left page */}
      <div
        className="relative h-full"
        style={{
          flex: 1,
          borderRadius: "12px 0 0 12px",
          overflow: "hidden",
          boxShadow: "inset -4px 0 12px rgba(0,0,0,0.08)",
        }}
      >
        <PageCanvas page={spread.left} side="left" />
      </div>

      {/* Spine */}
      <div
        style={{
          width: 60,
          flexShrink: 0,
          position: "relative",
          zIndex: 20,
          background:
            "linear-gradient(90deg, #caa43a 0%, #fff2a6 50%, #caa43a 100%)",
          boxShadow:
            "inset 2px 0 8px rgba(255,255,255,0.3), inset -2px 0 8px rgba(0,0,0,0.3)",
        }}
      >
        <BinderRings />
      </div>

      {/* Right page */}
      <div
        className="relative h-full"
        style={{
          flex: 1,
          borderRadius: "0 12px 12px 0",
          overflow: "hidden",
          boxShadow: "inset 4px 0 12px rgba(0,0,0,0.08)",
        }}
      >
        <PageCanvas page={spread.right} side="right" />
      </div>
    </div>
  );
}