"use client";

import { useRef, useState } from "react";
import { ImageElement as ImageElementType } from "@/lib/types";
import { useJournalStore, imageStore } from "@/store/journalStore";

interface Props {
  element: ImageElementType;
  side: "left" | "right";
  isSelected: boolean;
  onSelect: () => void;
}

export default function ImageElement({ element, side, isSelected, onSelect }: Props) {
  const { updateElement, deleteElement } = useJournalStore();

  const [pos, setPos] = useState({ x: element.x, y: element.y });
  const [size, setSize] = useState({ w: element.width, h: element.height });

  const dragging = useRef(false);
  const resizing = useRef(false);
  const dragOrigin = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });
  const resizeOrigin = useRef({ mx: 0, my: 0, ow: 0, oh: 0 });

  // resolve actual image src from imageStore
  const src = imageStore[element.src] ?? imageStore[element.id] ?? element.src;

  const startDrag = (e: React.MouseEvent) => {
    // don't drag when clicking resize handle
    if ((e.target as HTMLElement).dataset.resize) return;
    e.stopPropagation();
    e.preventDefault();
    onSelect();
    dragging.current = true;
    dragOrigin.current = {
      mx: e.clientX,
      my: e.clientY,
      ox: pos.x,
      oy: pos.y,
    };

    const move = (ev: MouseEvent) => {
      if (!dragging.current) return;
      setPos({
        x: dragOrigin.current.ox + ev.clientX - dragOrigin.current.mx,
        y: dragOrigin.current.oy + ev.clientY - dragOrigin.current.my,
      });
    };

    const up = (ev: MouseEvent) => {
      dragging.current = false;
      const nx = dragOrigin.current.ox + ev.clientX - dragOrigin.current.mx;
      const ny = dragOrigin.current.oy + ev.clientY - dragOrigin.current.my;
      setPos({ x: nx, y: ny });
      updateElement(side, element.id, { x: nx, y: ny });
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const startResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    resizing.current = true;
    resizeOrigin.current = {
      mx: e.clientX,
      my: e.clientY,
      ow: size.w,
      oh: size.h,
    };

    const move = (ev: MouseEvent) => {
      if (!resizing.current) return;
      setSize({
        w: Math.max(60, resizeOrigin.current.ow + ev.clientX - resizeOrigin.current.mx),
        h: Math.max(60, resizeOrigin.current.oh + ev.clientY - resizeOrigin.current.my),
      });
    };

    const up = (ev: MouseEvent) => {
      resizing.current = false;
      const nw = Math.max(60, resizeOrigin.current.ow + ev.clientX - resizeOrigin.current.mx);
      const nh = Math.max(60, resizeOrigin.current.oh + ev.clientY - resizeOrigin.current.my);
      setSize({ w: nw, h: nh });
      updateElement(side, element.id, { width: nw, height: nh });
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  return (
    <div
      data-element="image"
      className="absolute"
      style={{
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        zIndex: isSelected ? 50 : 10,
        cursor: "move",
        userSelect: "none",
      }}
      onMouseDown={startDrag}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Selection border */}
      {isSelected && (
        <div
          className="absolute pointer-events-none"
          style={{
            inset: -2,
            border: "2px dashed #C9A84C",
            borderRadius: 4,
          }}
        />
      )}

      {/* Delete button */}
      {isSelected && (
        <button
          className="absolute -top-3 -right-3 w-6 h-6 rounded-full text-white text-sm font-bold flex items-center justify-center z-50"
          style={{ background: "#e05070" }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            deleteElement(side, element.id);
          }}
        >
          ×
        </button>
      )}

      {/* Image */}
      <img
        src={src}
        alt={element.alt}
        draggable={false}
        className="w-full h-full object-cover rounded-sm pointer-events-none"
        style={{
          boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
          display: "block",
        }}
      />

      {/* Resize handle — bottom right corner */}
      {isSelected && (
        <div
          data-resize="true"
          onMouseDown={startResize}
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 16,
            height: 16,
            background: "#C9A84C",
            borderRadius: "4px 0 4px 0",
            cursor: "se-resize",
            zIndex: 51,
          }}
        />
      )}
    </div>
  );
}