"use client";

import { motion } from "framer-motion";

export default function BinderCover() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="relative flex items-center justify-center"
      style={{ width: 300, height: 400 }}
    >
      {/* Drop Shadow */}
      <div
        className="absolute bottom-[-12px] left-1/2 -translate-x-1/2"
        style={{
          width: 220,
          height: 30,
          background: "radial-gradient(ellipse, rgba(0,0,0,0.22) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      {/* Back cover peek (depth illusion) */}
      <div
        className="absolute top-2 right-[-6px] h-full rounded-r-2xl"
        style={{
          width: 260,
          background: "#e8b4c8",
          zIndex: 0,
        }}
      />

      {/* Spine */}
      <div
        className="absolute left-0 top-0 h-full rounded-l-xl z-20 flex flex-col items-center justify-around py-6"
        style={{
          width: 52,
          background: "linear-gradient(90deg, #b8860b 0%, #d4a017 30%, #c9a84c 60%, #a07010 100%)",
          boxShadow: "inset -4px 0 10px rgba(0,0,0,0.2), inset 2px 0 4px rgba(255,255,255,0.15)",
        }}
      >
        {/* Spine title */}
        <p
          className="text-xs tracking-widest opacity-60 select-none"
          style={{
            fontFamily: "var(--font-caveat)",
            color: "#fff8e7",
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            transform: "rotate(180deg)",
            letterSpacing: "0.2em",
          }}
        >
          my journal
        </p>

        {/* Rings */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="relative flex items-center justify-center" style={{ width: 32, height: 32 }}>
            {/* Ring back half */}
            <div
              className="absolute rounded-full"
              style={{
                width: 32,
                height: 32,
                background: "linear-gradient(145deg, #8B6914, #6b4f0a)",
                boxShadow: "0 3px 8px rgba(0,0,0,0.4)",
              }}
            />
            {/* Ring front half shine */}
            <div
              className="absolute rounded-full"
              style={{
                width: 32,
                height: 32,
                background: "linear-gradient(145deg, #F5E6A0 0%, #D4A820 40%, #8B6914 100%)",
                clipPath: "ellipse(50% 50% at 50% 50%)",
                boxShadow: "inset 0 2px 3px rgba(255,255,255,0.5)",
              }}
            />
            {/* Ring hole */}
            <div
              className="absolute rounded-full z-10"
              style={{
                width: 16,
                height: 16,
                background: "linear-gradient(135deg, #1a0f00, #3d2400)",
                boxShadow: "inset 0 2px 5px rgba(0,0,0,0.7)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Main Cover */}
      <div
        className="absolute z-10 h-full rounded-r-2xl overflow-hidden"
        style={{
          left: 44,
          width: 256,
          background: "#F8C8DC",
          boxShadow: "3px 0 0 #e8b4c8, 6px 2px 20px rgba(0,0,0,0.12)",
        }}
      >
        {/* Page edge lines (stacked pages illusion) */}
        <div
          className="absolute top-0 right-0 h-full"
          style={{ width: 6, background: "repeating-linear-gradient(to bottom, #f0b8cc, #f0b8cc 3px, #fce4ee 3px, #fce4ee 6px)" }}
        />

        {/* Soft inner light */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 60%)",
          }}
        />

        {/* Dot texture */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, #c084a0 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* Cover label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
          <div
            className="w-full py-4 px-5 rounded-2xl text-center"
            style={{
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(6px)",
              border: "1.5px solid rgba(255,255,255,0.85)",
              boxShadow: "0 4px 16px rgba(180,80,120,0.1)",
            }}
          >
            <p
              className="text-xs tracking-[0.2em] uppercase mb-2 opacity-60"
              style={{ fontFamily: "var(--font-nunito)", color: "#8a2040" }}
            >
              private archives
            </p>
            <p
              className="text-3xl"
              style={{ fontFamily: "var(--font-caveat)", color: "#6a1030", fontWeight: 700 }}
            >
              My Moments
            </p>
            <div className="mt-2 h-px w-12 mx-auto" style={{ background: "#e8a0bc" }} />
          </div>

          {/* Deco stickers */}
          <div className="flex gap-3">
            {["🌸", "⭐", "🦋"].map((s, i) => (
              <motion.span
                key={i}
                className="text-xl"
                animate={{ rotate: [0, 10, -10, 0], y: [0, -4, 0] }}
                transition={{ duration: 3 + i * 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              >
                {s}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Bottom vol tag */}
        <p
          className="absolute bottom-5 right-6 text-sm opacity-30 select-none"
          style={{ fontFamily: "var(--font-caveat)", color: "#8a2040", transform: "rotate(-6deg)" }}
        >
          vol. 01
        </p>
      </div>
    </motion.div>
  );
}