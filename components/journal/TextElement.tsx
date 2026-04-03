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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dragging = useRef(false);
  const moved = useRef(false);
  const dragOrigin = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });

  // Auto open editing when brand new (empty content)
  useEffect(() => {
    if (element.content === "" && isSelected) {
      setIsEditing(true);
    }
  }, [isSelected]);

  useEffect(() => {
    if (isEditing) {
      const t = setTimeout(() => {
        textareaRef.current?.focus();
      }, 10);
      return () => clearTimeout(t);
    }
  }, [isEditing]);

  const startDrag = (e: React.MouseEvent) => {
    if (isEditing) return;
    e.stopPropagation();
    moved.current = false;
    dragging.current = true;
    dragOrigin.current = {
      mx: e.clientX,
      my: e.clientY,
      ox: pos.x,
      oy: pos.y,
    };

    const move = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const dx = ev.clientX - dragOrigin.current.mx;
      const dy = ev.clientY - dragOrigin.current.my;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved.current = true;
      setPos({
        x: dragOrigin.current.ox + dx,
        y: dragOrigin.current.oy + dy,
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

  return (
    <div
      data-element="text"
      className="absolute"
      style={{
        left: pos.x,
        top: pos.y,
        width: element.width,
        zIndex: isSelected ? 50 : 10,
        cursor: isEditing ? "text" : "move",
        userSelect: isEditing ? "text" : "none",
        minHeight: 40,
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
      {/* Selection ring */}
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
      {isSelected && !isEditing && (
        <button
          className="absolute -top-3 -right-3 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center z-50"
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

      {isEditing ? (
        <textarea
          ref={textareaRef}
          data-element="text"
          className="w-full bg-transparent resize-none outline-none border-none p-1"
          style={{
            fontFamily: element.fontFamily,
            fontSize: element.fontSize,
            color: element.color,
            fontWeight: element.bold ? 700 : 400,
            fontStyle: element.italic ? "italic" : "normal",
            lineHeight: 1.6,
            minHeight: 60,
            display: "block",
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
          className="p-1 whitespace-pre-wrap break-words w-full"
          style={{
            fontFamily: element.fontFamily,
            fontSize: element.fontSize,
            color: element.color,
            fontWeight: element.bold ? 700 : 400,
            fontStyle: element.italic ? "italic" : "normal",
            lineHeight: 1.6,
            minHeight: 32,
          }}
        >
          {element.content || (
            <span className="opacity-25 italic">Type here...</span>
          )}
        </p>
      )}
    </div>
  );
}