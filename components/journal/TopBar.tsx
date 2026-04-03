"use client";

import { useJournalStore } from "@/store/journalStore";
import { FONTS, FONT_SIZES, PAGE_TYPES } from "@/lib/constants";
import { TextElement } from "@/lib/types";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { useState, useRef, useEffect } from "react";

export default function TopBar() {
  const router = useRouter();
  const {
    spreads, currentSpreadIndex,
    activePageSide, selectedElementId, selectedElementSide,
    updateElement, setPageType, setPageColor,
  } = useJournalStore();

  const spread = spreads[currentSpreadIndex];
  const activePage = spread[activePageSide];

  // find selected element
  const selectedEl =
    selectedElementSide
      ? (spread[selectedElementSide].elements.find(
          (e) => e.id === selectedElementId
        ) as TextElement | undefined)
      : undefined;

  const [showTextColor, setShowTextColor] = useState(false);
  const [showPageColor, setShowPageColor] = useState(false);
  const textColorRef = useRef<HTMLDivElement>(null);
  const pageColorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (textColorRef.current && !textColorRef.current.contains(e.target as Node))
        setShowTextColor(false);
      if (pageColorRef.current && !pageColorRef.current.contains(e.target as Node))
        setShowPageColor(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      className="flex items-center gap-3 px-4 py-2 rounded-2xl flex-wrap w-full max-w-5xl"
      style={{
        background: "white",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* Back */}
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-1 text-sm"
        style={{ color: "#888", fontFamily: "var(--font-nunito)" }}
      >
        <ArrowLeft size={15} /> Home
      </button>

      <div className="w-px h-6 bg-gray-100" />

      {/* Active page indicator */}
      <div
        className="px-3 py-1 rounded-lg text-xs font-semibold"
        style={{
          background: activePageSide === "left" ? "#fff0e8" : "#e8f0ff",
          color: activePageSide === "left" ? "#C9603C" : "#4a80c9",
          fontFamily: "var(--font-nunito)",
          border: `1px solid ${activePageSide === "left" ? "#f0c8a0" : "#a0b8f0"}`,
        }}
      >
        {activePageSide === "left" ? "← Left page" : "Right page →"}
      </div>

      <div className="w-px h-6 bg-gray-100" />

      {/* Page type — applies to activePageSide */}
      <div className="flex items-center gap-1">
        <span className="text-xs opacity-40 mr-1" style={{ fontFamily: "var(--font-nunito)" }}>
          Style
        </span>
        {PAGE_TYPES.map((pt) => (
          <button
            key={pt.value}
            onClick={() => setPageType(activePageSide, pt.value)}
            className="px-3 py-1 rounded-lg text-xs transition-all"
            style={{
              fontFamily: "var(--font-nunito)",
              background: activePage.pageType === pt.value ? "#FFF5E4" : "transparent",
              color: activePage.pageType === pt.value ? "#C9603C" : "#888",
              border:
                activePage.pageType === pt.value
                  ? "1px solid #f0c8a0"
                  : "1px solid transparent",
            }}
          >
            {pt.label}
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-gray-100" />

      {/* Page color */}
      <div className="flex items-center gap-2 relative" ref={pageColorRef}>
        <span className="text-xs opacity-40" style={{ fontFamily: "var(--font-nunito)" }}>
          Pg
        </span>
        <button
          onClick={() => {
            setShowPageColor(!showPageColor);
            setShowTextColor(false);
          }}
          className="w-6 h-6 rounded-full"
          style={{
            background: activePage.bgColor,
            boxShadow: "0 0 0 2px #ddd",
          }}
        />
        {showPageColor && (
          <div className="absolute top-10 left-0 z-50 rounded-xl overflow-hidden shadow-2xl">
            <HexColorPicker
              color={activePage.bgColor}
              onChange={(c) => setPageColor(activePageSide, c)}
            />
          </div>
        )}
      </div>

      {/* Text controls */}
      {selectedEl?.type === "text" && selectedElementSide && (
        <>
          <div className="w-px h-6 bg-gray-100" />

          <select
            className="text-xs px-2 py-1 rounded-lg outline-none"
            style={{
              fontFamily: "var(--font-nunito)",
              background: "#f9f9f9",
              border: "1px solid #eee",
              color: "#555",
            }}
            value={selectedEl.fontFamily}
            onChange={(e) =>
              updateElement(selectedElementSide, selectedEl.id, {
                fontFamily: e.target.value,
              })
            }
          >
            {FONTS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>

          <select
            className="text-xs px-2 py-1 rounded-lg outline-none"
            style={{
              fontFamily: "var(--font-nunito)",
              background: "#f9f9f9",
              border: "1px solid #eee",
              color: "#555",
              width: 60,
            }}
            value={selectedEl.fontSize}
            onChange={(e) =>
              updateElement(selectedElementSide, selectedEl.id, {
                fontSize: Number(e.target.value),
              })
            }
          >
            {FONT_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            className="w-7 h-7 rounded-lg text-sm font-bold flex items-center justify-center"
            style={{
              background: selectedEl.bold ? "#FFF5E4" : "transparent",
              color: selectedEl.bold ? "#C9603C" : "#888",
              border: selectedEl.bold ? "1px solid #f0c8a0" : "1px solid transparent",
            }}
            onClick={() =>
              updateElement(selectedElementSide, selectedEl.id, { bold: !selectedEl.bold })
            }
          >
            B
          </button>

          <button
            className="w-7 h-7 rounded-lg text-sm italic flex items-center justify-center"
            style={{
              background: selectedEl.italic ? "#FFF5E4" : "transparent",
              color: selectedEl.italic ? "#C9603C" : "#888",
              border: selectedEl.italic ? "1px solid #f0c8a0" : "1px solid transparent",
            }}
            onClick={() =>
              updateElement(selectedElementSide, selectedEl.id, { italic: !selectedEl.italic })
            }
          >
            I
          </button>

          {/* Text color */}
          <div className="flex items-center gap-1 relative" ref={textColorRef}>
            <span
              className="text-xs font-bold opacity-40"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              A
            </span>
            <button
              onClick={() => {
                setShowTextColor(!showTextColor);
                setShowPageColor(false);
              }}
              className="w-6 h-6 rounded-full"
              style={{ background: selectedEl.color, boxShadow: "0 0 0 2px #ddd" }}
            />
            {showTextColor && (
              <div className="absolute top-10 left-0 z-50 rounded-xl overflow-hidden shadow-2xl">
                <HexColorPicker
                  color={selectedEl.color}
                  onChange={(c) =>
                    updateElement(selectedElementSide, selectedEl.id, { color: c })
                  }
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}