"use client";

import { useRef } from "react";
import { nanoid } from "nanoid";
import { Page } from "@/lib/types";
import { useJournalStore, imageStore } from "@/store/journalStore";
import { DEFAULT_TEXT_ELEMENT } from "@/lib/constants";
import PageBackground from "./PageBackground";
import TextElementComponent from "./TextElement";
import ImageElementComponent from "./ImageElement";

interface Props {
  page: Page;
  side: "left" | "right";
}

export default function PageCanvas({ page, side }: Props) {
  const {
    activeTool,
    selectedElementId,
    selectedElementSide,
    activePageSide,
    setSelectedElement,
    setActivePageSide,
    addElement,
  } = useJournalStore();

  const canvasRef = useRef<HTMLDivElement>(null);
  const isActive = activePageSide === side;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Always set this page as active when clicked anywhere on it
    setActivePageSide(side);

    // Deselect if clicking background (not a child element with data-element)
    const target = e.target as HTMLElement;
    const clickedElement = target.closest("[data-element]");
    if (!clickedElement) {
      setSelectedElement(null);
    }

    // Add text box only if text tool and clicked on bare canvas background
    if (activeTool === "text" && !clickedElement) {
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left - 100;
      const y = e.clientY - rect.top - 16;
      const id = nanoid();
      addElement(side, {
        ...DEFAULT_TEXT_ELEMENT,
        id,
        type: "text",
        x: Math.max(4, x),
        y: Math.max(4, y),
        content: "",
      });
      setTimeout(() => setSelectedElement(id, side), 0);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActivePageSide(side);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        const id = nanoid();
        imageStore[id] = src;
        addElement(side, {
          id,
          type: "image",
          src: id,
          alt: file.name,
          x: Math.max(0, e.clientX - rect.left - 90),
          y: Math.max(0, e.clientY - rect.top - 70),
          width: 180,
          height: 140,
          rotation: 0,
        });
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full"
      style={{
        cursor: activeTool === "text" ? "crosshair" : "default",
        outline: isActive ? "2.5px solid rgba(201,168,76,0.45)" : "none",
        outlineOffset: "-2px",
        overflow: "hidden",
        borderRadius: side === "left" ? "10px 0 0 10px" : "0 10px 10px 0",
      }}
      onClick={handleClick}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <PageBackground pageType={page.pageType} bgColor={page.bgColor} />

      {page.elements.map((el) =>
        el.type === "text" ? (
          <TextElementComponent
            key={el.id}
            element={el}
            side={side}
            isSelected={selectedElementId === el.id && selectedElementSide === side}
            onSelect={() => {
              setSelectedElement(el.id, side);
              setActivePageSide(side);
            }}
          />
        ) : (
          <ImageElementComponent
            key={el.id}
            element={el}
            side={side}
            isSelected={selectedElementId === el.id && selectedElementSide === side}
            onSelect={() => {
              setSelectedElement(el.id, side);
              setActivePageSide(side);
            }}
          />
        )
      )}

      {/* Page label */}
      <div
        className="absolute bottom-2 left-3 pointer-events-none select-none"
        style={{
          fontFamily: "var(--font-caveat)",
          fontSize: 13,
          color: "#999",
          opacity: isActive ? 0.5 : 0.15,
        }}
      >
        {side} page {isActive ? "✦" : ""}
      </div>

      {activeTool === "image" &&
        page.elements.filter((e) => e.type === "image").length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p
              className="opacity-10 select-none"
              style={{ fontFamily: "var(--font-caveat)", fontSize: 22 }}
            >
              drop image here
            </p>
          </div>
        )}
    </div>
  );
}