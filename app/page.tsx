"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import BinderCover from "@/components/home/BinderCover";
import FloatingStickers from "@/components/home/FloatingStickers";

export default function HomePage() {
  const router = useRouter();

  return (
    <main
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-8"
      style={{ background: "#FFF5E4" }}
    >
      {/* Dot texture */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #d4a0b0 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <FloatingStickers />

      {/* Side by side layout */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-16 md:gap-24 w-full max-w-5xl">

        {/* LEFT — Binder */}
        <BinderCover />

        {/* RIGHT — Text + Button */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-start gap-6 max-w-sm"
        >
          {/* Badge */}
          <div
            className="px-4 py-1.5 rounded-full text-xs tracking-widest uppercase"
            style={{
              background: "#F8C8DC",
              color: "#8a2040",
              fontFamily: "var(--font-nunito)",
              fontWeight: 600,
            }}
          >
            ✦ your digital journal
          </div>

          {/* Headline */}
          <div>
            <h1
              className="text-6xl leading-none"
              style={{ fontFamily: "var(--font-caveat)", color: "#6a1030" }}
            >
              Every scrap
            </h1>
            <h1
              className="text-6xl leading-none"
              style={{ fontFamily: "var(--font-caveat)", color: "#C9A84C" }}
            >
              has a story.
            </h1>
          </div>

          {/* Description */}
          <p
            className="text-sm leading-relaxed opacity-60"
            style={{ fontFamily: "var(--font-nunito)", color: "#5a1025" }}
          >
            Scrapbook spreads, daily journals, aesthetic pages or clean notes — all in one beautiful binder.
          </p>

          {/* Features list */}
          <ul className="flex flex-col gap-2">
            {[
              "Upload & arrange images freely",
              "Multiple fonts & text colours",
              "Stickers & decorations",
            ].map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="text-sm opacity-70"
                style={{ fontFamily: "var(--font-nunito)", color: "#5a1025" }}
              >
                {f}
              </motion.li>
            ))}
          </ul>

          {/* Flat button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/journal")}
            className="mt-2 px-10 py-4 rounded-2xl text-white text-base tracking-wide"
            style={{
              fontFamily: "var(--font-nunito)",
              fontWeight: 700,
              background: "#fba0ed",
              boxShadow: "4px 4px 0px #c330c1",
            }}
          >
            Open Journal →
          </motion.button>

          {/* Hint */}
          <p
            className="text-xs opacity-40"
            style={{ fontFamily: "var(--font-nunito)", color: "#8a2040" }}
          >
            no account needed · saves locally ✦
          </p>
        </motion.div>
      </div>
    </main>
  );
}