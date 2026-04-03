"use client";

import BinderSpread from "@/components/journal/BinderSpread";
import Toolbar from "@/components/journal/Toolbar";
import TopBar from "@/components/journal/TopBar";
import SpreadNav from "@/components/journal/SpreadNav";

export default function JournalPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-between gap-4 py-6 px-4"
      style={{
        background: "#FFF5E4",
        backgroundImage: "radial-gradient(circle, #d4a0b0 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      {/* Top bar */}
      <TopBar />

      {/* Center — binder + toolbar */}
      <div className="flex items-center gap-4 w-full justify-center flex-1">
        <Toolbar />
        <BinderSpread />
      </div>

      {/* Bottom nav */}
      <SpreadNav />
    </main>
  );
}