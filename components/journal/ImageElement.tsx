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
  const { updateElement, deleteElement, addElement } = useJournalStore();

  const [pos, setPos] = useState({ x: element.x, y: element.y });
  const [size, setSize] = useState({ w: element.width, h: element.height });
  // track if we've visually crossed to other side during drag
  const [draggingSide, setDraggingSide] = useState<"left" | "right">(side);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const resizing = useRef(false);
  const dragOrigin = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });
  const resizeOrigin = useRef({ mx: 0, my: 0, ow: 0, oh: 0 });

  const src = imageStore[element.src] ?? imageStore[element.id] ?? element.src;

  // Get the full spread container bounds
  const getSpreadBounds = () => {
    let el = containerRef.current?.parentElement;
    // walk up until we find the spread wrapper
    while (el && !el.dataset.spread) {
      el = el.parentElement;
    }
    return el?.getBoundingClientRect() ?? null;
  };

  // Get left page bounds to determine which side the image is on
  const getLeftPageBounds = () => {
    let el = containerRef.current?.parentElement;
    while (el && !el.dataset.spread) {
      el = el.parentElement;
    }
    const leftPage = el?.querySelector("[data-page='left']");
    return leftPage?.getBoundingClientRect() ?? null;
  };

  const startDrag = (e: React.MouseEvent) => {
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
      const dx = ev.clientX - dragOrigin.current.mx;
      const dy = ev.clientY - dragOrigin.current.my;
      setPos({
        x: dragOrigin.current.ox + dx,
        y: dragOrigin.current.oy + dy,
      });
    };

    const up = (ev: MouseEvent) => {
      if (!dragging.current) return;
      dragging.current = false;

      const dx = ev.clientX - dragOrigin.current.mx;
      const dy = ev.clientY - dragOrigin.current.my;
      const newX = dragOrigin.current.ox + dx;
      const newY = dragOrigin.current.oy + dy;

      // Determine which page the image was dropped on
      // by checking cursor position against left page bounds
      const leftPageBounds = getLeftPageBounds();
      let landedSide: "left" | "right" = side;
      let finalX = newX;
      let finalY = newY;

      if (leftPageBounds) {
        const cursorOnLeft = ev.clientX < leftPageBounds.right;
        landedSide = cursorOnLeft ? "left" : "right";

        if (landedSide !== side) {
          // Image crossed pages — remove from current, add to new page
          // Calculate position relative to the new page
          const spreadBounds = getSpreadBounds();
          if (spreadBounds) {
            if (landedSide === "left") {
              finalX = ev.clientX - leftPageBounds.left - size.w / 2;
              finalY = newY;
            } else {
              // right page starts after left page + spine
              const rightPageLeft = leftPageBounds.right + 64;
              finalX = ev.clientX - rightPageLeft - size.w / 2;
              finalY = newY;
            }
          }
          finalX = Math.max(0, finalX);
          finalY = Math.max(0, finalY);

          // delete from old side, add to new side
          deleteElement(side, element.id);
          addElement(landedSide, {
            ...element,
            x: finalX,
            y: finalY,
            width: size.w,
            height: size.h,
          });
        } else {
          // Same page — just update position
          setPos({ x: newX, y: newY });
          updateElement(side, element.id, { x: newX, y: newY });
        }
      } else {
        setPos({ x: newX, y: newY });
        updateElement(side, element.id, { x: newX, y: newY });
      }

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
      ref={containerRef}
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

      {isSelected && (
        <button
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