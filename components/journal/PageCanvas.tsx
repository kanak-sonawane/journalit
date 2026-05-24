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
    setSelectedElement,
    addElement,
  } = useJournalStore();

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const clickedElement = target.closest("[data-element]");

    if (!clickedElement) {
      setSelectedElement(null);

      if (activeTool === "text") {
        const rect = canvasRef.current!.getBoundingClientRect();
        // coordinates relative to THIS page canvas
        const x = e.clientX - rect.left - 150;
        const y = e.clientY - rect.top - 16;
        const id = nanoid();
        addElement(side, {
          ...DEFAULT_TEXT_ELEMENT,
          id,
          type: "text",
          x: Math.max(4, x),
          y: Math.max(4, y),
          content: "",
          width: 300,
        });
        setTimeout(() => setSelectedElement(id, side), 0);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); // prevent bubbling to other page

    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!canvasRef.current || files.length === 0) return;

    // Get THIS page canvas bounds specifically
    const rect = canvasRef.current.getBoundingClientRect();

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        const id = nanoid();
        imageStore[id] = src;

        // Position relative to this specific canvas
        const x = e.clientX - rect.left - 90;
        const y = e.clientY - rect.top - 70;

        addElement(side, {
          id,
          type: "image",
          src: id,
          alt: file.name,
          x: Math.max(0, Math.min(x, rect.width - 180)),
          y: Math.max(0, Math.min(y, rect.height - 140)),
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
        overflow: "hidden",
        borderRadius: side === "left" ? "10px 0 0 10px" : "0 10px 10px 0",
      }}
      onClick={handleClick}
      onDragOver={handleDragOver}
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
            onSelect={() => setSelectedElement(el.id, side)}
          />
        ) : (
          <ImageElementComponent
            key={el.id}
            element={el}
            side={side}
            isSelected={selectedElementId === el.id && selectedElementSide === side}
            onSelect={() => setSelectedElement(el.id, side)}
          />
        )
      )}

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