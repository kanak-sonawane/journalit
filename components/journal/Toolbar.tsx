"use client";

import { MousePointer2, Type, ImageIcon, Upload } from "lucide-react";
import { useRef } from "react";
import { nanoid } from "nanoid";
import { useJournalStore, imageStore } from "@/store/journalStore";
import { ActiveTool } from "@/lib/types";

const tools: { icon: React.ReactNode; label: string; value: ActiveTool }[] = [
  { icon: <MousePointer2 size={18} />, label: "Select", value: "select" },
  { icon: <Type size={18} />, label: "Text", value: "text" },
  { icon: <ImageIcon size={18} />, label: "Image", value: "image" },
];

export default function Toolbar() {
  const { activeTool, setActiveTool, activePageSide, addElement } = useJournalStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        const id = nanoid();
        // store in memory, not localStorage
        imageStore[id] = src;
        addElement(activePageSide, {
          id,
          type: "image",
          src: `__img__${id}`,
          alt: file.name,
          x: 40,
          y: 40,
          width: 180,
          height: 140,
          rotation: 0,
        });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  return (
    <div
      className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl"
      style={{
        background: "white",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {tools.map((tool) => (
        <button
          key={tool.value}
          title={tool.label}
          onClick={() => setActiveTool(tool.value)}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
          style={{
            background: activeTool === tool.value ? "#FFF5E4" : "transparent",
            color: activeTool === tool.value ? "#C9603C" : "#888",
            border: activeTool === tool.value ? "1.5px solid #f0c8a0" : "1.5px solid transparent",
          }}
        >
          {tool.icon}
        </button>
      ))}

      <div className="w-6 h-px my-1" style={{ background: "rgba(0,0,0,0.08)" }} />

      <button
        title="Upload Image"
        onClick={() => fileRef.current?.click()}
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ color: "#888", border: "1.5px solid transparent" }}
      >
        <Upload size={18} />
      </button>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} />
    </div>
  );
}