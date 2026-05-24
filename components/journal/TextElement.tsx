"use client";

import { useRef, useState, useEffect } from "react";
import { TextElement as TextElementType } from "@/lib/types";
import { useJournalStore } from "@/store/journalStore";

interface Props {
  element: TextElementType;
  side: "left" | "right";
  isSelected: boolean;
  onSelect: () => void;
}

export default function TextElement({ element, side, isSelected, onSelect }: Props) {
  const { updateElement, deleteElement } = useJournalStore();
  const [isEditing, setIsEditing] = useState(false);
  const [pos, setPos] = useState({ x: element.x, y: element.y });
  const [width, setWidth] = useState(element.width ?? 300);
  const [height, setHeight] = useState(element.height ?? 80);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const dragging = useRef(false);
  const moved = useRef(false);
  const dragOrigin = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });

  const resizingWidth = useRef(false);
  const resizeWidthOrigin = useRef({ mx: 0, ow: 0 });

  const resizingHeight = useRef(false);
  const resizeHeightOrigin = useRef({ my: 0, oh: 0 });

  const resizingCorner = useRef(false);
  const resizeCornerOrigin = useRef({ mx: 0, my: 0, ow: 0, oh: 0 });

  useEffect(() => {
    if (element.content === "" && isSelected) {
      setIsEditing(true);
    }
  }, [isSelected]);

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => textareaRef.current?.focus(), 10);
    }
  }, [isEditing]);

  // ── Drag ──
  const startDrag = (e: React.MouseEvent) => {
    if (isEditing) return;
    e.stopPropagation();
    moved.current = false;
    dragging.current = true;
    dragOrigin.current = { mx: e.clientX, my: e.clientY, ox: pos.x, oy: pos.y };

    const move = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const dx = ev.clientX - dragOrigin.current.mx;
      const dy = ev.clientY - dragOrigin.current.my;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved.current = true;
      setPos({ x: dragOrigin.current.ox + dx, y: dragOrigin.current.oy + dy });
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

  // ── Width resize (right edge) ──
  const startWidthResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    resizingWidth.current = true;
    resizeWidthOrigin.current = { mx: e.clientX, ow: width };

    const move = (ev: MouseEvent) => {
      if (!resizingWidth.current) return;
      setWidth(Math.max(120, resizeWidthOrigin.current.ow + ev.clientX - resizeWidthOrigin.current.mx));
    };

    const up = (ev: MouseEvent) => {
      resizingWidth.current = false;
      const nw = Math.max(120, resizeWidthOrigin.current.ow + ev.clientX - resizeWidthOrigin.current.mx);
      setWidth(nw);
      updateElement(side, element.id, { width: nw });
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  // ── Height resize (bottom edge) ──
  const startHeightResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    resizingHeight.current = true;
    resizeHeightOrigin.current = { my: e.clientY, oh: height };

    const move = (ev: MouseEvent) => {
      if (!resizingHeight.current) return;
      setHeight(Math.max(40, resizeHeightOrigin.current.oh + ev.clientY - resizeHeightOrigin.current.my));
    };

    const up = (ev: MouseEvent) => {
      resizingHeight.current = false;
      const nh = Math.max(40, resizeHeightOrigin.current.oh + ev.clientY - resizeHeightOrigin.current.my);
      setHeight(nh);
      updateElement(side, element.id, { height: nh });
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  // ── Corner resize (bottom-right) ──
  const startCornerResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    resizingCorner.current = true;
    resizeCornerOrigin.current = { mx: e.clientX, my: e.clientY, ow: width, oh: height };

    const move = (ev: MouseEvent) => {
      if (!resizingCorner.current) return;
      setWidth(Math.max(120, resizeCornerOrigin.current.ow + ev.clientX - resizeCornerOrigin.current.mx));
      setHeight(Math.max(40, resizeCornerOrigin.current.oh + ev.clientY - resizeCornerOrigin.current.my));
    };

    const up = (ev: MouseEvent) => {
      resizingCorner.current = false;
      const nw = Math.max(120, resizeCornerOrigin.current.ow + ev.clientX - resizeCornerOrigin.current.mx);
      const nh = Math.max(40, resizeCornerOrigin.current.oh + ev.clientY - resizeCornerOrigin.current.my);
      setWidth(nw);
      setHeight(nh);
      updateElement(side, element.id, { width: nw, height: nh });
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  return (
    <div
      data-element="text"
      className="absolute"
      style={{
        left: pos.x,
        top: pos.y,
        width,
        height,
        zIndex: isSelected ? 50 : 10,
        cursor: isEditing ? "text" : "move",
        userSelect: isEditing ? "text" : "none",
      }}
      onMouseDown={startDrag}
      onClick={(e) => {
        e.stopPropagation();
        if (!moved.current) onSelect();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onSelect();
        setIsEditing(true);
      }}
    >
      {/* Selection border */}
      {isSelected && (
        <div
          className="absolute pointer-events-none"
          style={{
            inset: -3,
            border: "1.5px dashed #C9A84C",
            borderRadius: 4,
          }}
        />
      )}

      {/* Delete button */}
      {isSelected && (
        <button
          data-element="text"
          className="absolute flex items-center justify-center font-bold z-50"
          style={{
            top: -14,
            right: -14,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#e05070",
            color: "white",
            fontSize: 18,
            border: "2px solid white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            cursor: "pointer",
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            deleteElement(side, element.id);
          }}
        >
          ×
        </button>
      )}

      {/* Content */}
      {isEditing ? (
        <textarea
          ref={textareaRef}
          data-element="text"
          className="bg-transparent outline-none border-none p-1"
          style={{
            width: "100%",
            height: "100%",
            resize: "none",
            fontFamily: element.fontFamily,
            fontSize: element.fontSize,
            color: element.color,
            fontWeight: element.bold ? 700 : 400,
            fontStyle: element.italic ? "italic" : "normal",
            lineHeight: 1.6,
            display: "block",
            overflow: "auto",
          }}
          value={element.content}
          onChange={(e) =>
            updateElement(side, element.id, { content: e.target.value })
          }
          onBlur={() => setIsEditing(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsEditing(false);
            e.stopPropagation();
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        />
      ) : (
        <p
          data-element="text"
          className="p-1 whitespace-pre-wrap break-words w-full h-full overflow-hidden"
          style={{
            fontFamily: element.fontFamily,
            fontSize: element.fontSize,
            color: element.color,
            fontWeight: element.bold ? 700 : 400,
            fontStyle: element.italic ? "italic" : "normal",
            lineHeight: 1.6,
          }}
        >
          {element.content || (
            <span className="opacity-25 italic">Type here...</span>
          )}
        </p>
      )}

      {/* Right edge — width resize */}
      {isSelected && (
        <div
          data-element="text"
          onMouseDown={startWidthResize}
          style={{
            position: "absolute",
            right: -6,
            top: "50%",
            transform: "translateY(-50%)",
            width: 12,
            height: 36,
            background: "#C9A84C",
            borderRadius: 6,
            cursor: "ew-resize",
            zIndex: 51,
            opacity: 0.85,
          }}
        />
      )}

      {/* Bottom edge — height resize */}
      {isSelected && (
        <div
          data-element="text"
          onMouseDown={startHeightResize}
          style={{
            position: "absolute",
            bottom: -6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 36,
            height: 12,
            background: "#C9A84C",
            borderRadius: 6,
            cursor: "ns-resize",
            zIndex: 51,
            opacity: 0.85,
          }}
        />
      )}

      {/* Bottom-right corner — both */}
      {isSelected && (
        <div
          data-element="text"
          onMouseDown={startCornerResize}
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 16,
            height: 16,
            background: "#C9A84C",
            borderRadius: "4px 0 4px 0",
            cursor: "se-resize",
            zIndex: 52,
          }}
        />
      )}
    </div>
  );
}