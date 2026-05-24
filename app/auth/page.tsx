"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Check your email to confirm your account!");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push("/journal");
      }
    }

    setLoading(false);
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
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

      {/* Floating deco */}
      {["🌸", "⭐", "📎", "✂️", "🦋"].map((s, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl pointer-events-none select-none"
          style={{
            top: `${10 + i * 18}%`,
            left: i % 2 === 0 ? "5%" : "92%",
          }}
          animate={{ y: [0, -12, 0], rotate: [0, 8, -8, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          {s}
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Card */}
        <div
          className="rounded-3xl p-8 flex flex-col gap-6"
          style={{
            background: "white",
            boxShadow: "0 8px 40px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {/* Header */}
          <div className="flex flex-col items-center gap-1 text-center">
            <p
              className="text-4xl mb-1"
              style={{ fontFamily: "var(--font-caveat)" }}
            >
              📖
            </p>
            <h1
              className="text-3xl"
              style={{ fontFamily: "var(--font-caveat)", color: "#6a1030" }}
            >
              {mode === "login" ? "Welcome back" : "Start your journal"}
            </h1>
            <p
              className="text-xs opacity-50"
              style={{ fontFamily: "var(--font-nunito)", color: "#5a1025" }}
            >
              {mode === "login"
                ? "Your spreads are waiting"
                : "Every scrap has a story"}
            </p>
          </div>

          {/* Mode toggle */}
          <div
            className="flex rounded-xl p-1 gap-1"
            style={{ background: "#f5f5f5" }}
          >
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError(null);
                  setSuccess(null);
                }}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  fontFamily: "var(--font-nunito)",
                  background: mode === m ? "white" : "transparent",
                  color: mode === m ? "#C9603C" : "#aaa",
                  boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {m === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl outline-none text-sm"
                    style={{
                      fontFamily: "var(--font-nunito)",
                      background: "#fafafa",
                      border: "1.5px solid #eee",
                      color: "#333",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl outline-none text-sm"
              style={{
                fontFamily: "var(--font-nunito)",
                background: "#fafafa",
                border: "1.5px solid #eee",
                color: "#333",
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl outline-none text-sm"
              style={{
                fontFamily: "var(--font-nunito)",
                background: "#fafafa",
                border: "1.5px solid #eee",
                color: "#333",
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {/* Error / Success */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-center px-3 py-2 rounded-xl"
                style={{
                  fontFamily: "var(--font-nunito)",
                  background: "#ffe8ec",
                  color: "#c03050",
                }}
              >
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-center px-3 py-2 rounded-xl"
                style={{
                  fontFamily: "var(--font-nunito)",
                  background: "#e8f5e9",
                  color: "#2e7d32",
                }}
              >
                {success}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !email || !password}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all"
            style={{
              fontFamily: "var(--font-nunito)",
              background: loading || !email || !password ? "#ddd" : "#C9603C",
              boxShadow: loading || !email || !password
                ? "none"
                : "4px 4px 0px #8B3A20",
              color: loading || !email || !password ? "#aaa" : "white",
              cursor: loading || !email || !password ? "not-allowed" : "pointer",
            }}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Open my journal →"
              : "Create account →"}
          </button>

          {/* Back to home */}
          <p
            className="text-center text-xs opacity-40 cursor-pointer hover:opacity-70 transition-opacity"
            style={{ fontFamily: "var(--font-nunito)", color: "#5a1025" }}
            onClick={() => router.push("/")}
          >
            ← back to home
          </p>
        </div>
      </motion.div>
    </main>
  );
}