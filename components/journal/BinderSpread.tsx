"use client";

import { useJournalStore } from "@/store/journalStore";
import BinderRings from "./BinderRings";
import PageCanvas from "./PageCanvas";

export default function BinderSpread() {
  const { spreads, currentSpreadIndex } = useJournalStore();
  const spread = spreads[currentSpreadIndex];

  return (
    <div
      data-spread="true"
      className="relative flex"
      style={{
        maxWidth: 1100,
        width: "100%",
        height: "75vh",
        minHeight: 520,
        borderRadius: 12,
        boxShadow: "0 24px 64px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.1)",
      }}
    >
      {/* Left page */}
      <div
        data-page="left"
        className="relative h-full"
        style={{
          width: "calc(50% - 32px)",
          borderRadius: "12px 0 0 12px",
          overflow: "hidden",
          flexShrink: 0,
          zIndex: 1,
        }}
      >
        <PageCanvas page={spread.left} side="left" />
      </div>

      {/* Spine */}
      <div
        style={{
          width: 64,
          flexShrink: 0,
          position: "relative",
          zIndex: 20,
          pointerEvents: "none",
          background:
            "linear-gradient(90deg, #c8a830 0%, #e8d070 20%, #f5e898 50%, #e8d070 80%, #b89020 100%)",
          boxShadow:
            "inset 2px 0 8px rgba(255,255,255,0.2), inset -2px 0 8px rgba(0,0,0,0.2)",
        }}
      >
        <div
          className="absolute inset-y-0"
          style={{ left: "20%", width: 1, background: "rgba(0,0,0,0.08)" }}
        />
        <div
          className="absolute inset-y-0"
          style={{ right: "20%", width: 1, background: "rgba(0,0,0,0.08)" }}
        />
        <BinderRings />
      </div>

      {/* Right page */}
      <div
        data-page="right"
        className="relative h-full"
        style={{
          width: "calc(50% - 32px)",
          borderRadius: "0 12px 12px 0",
          overflow: "hidden",
          flexShrink: 0,
          zIndex: 1,
        }}
      >
        <PageCanvas page={spread.right} side="right" />
      </div>
    </div>
  );
}