"use client";

import { motion } from "framer-motion";
import { FLOATING_STICKERS } from "@/lib/constants";

const positions = [
  { top: "8%",  left: "6%"  },
  { top: "15%", left: "82%" },
  { top: "30%", left: "4%"  },
  { top: "72%", left: "8%"  },
  { top: "80%", left: "78%" },
  { top: "55%", left: "88%" },
  { top: "5%",  left: "50%" },
  { top: "88%", left: "42%" },
  { top: "42%", left: "92%" },
  { top: "62%", left: "2%"  },
];

export default function FloatingStickers() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {FLOATING_STICKERS.map((sticker, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl select-none"
          style={{ top: positions[i].top, left: positions[i].left }}
          animate={{
            y: [0, -18, 4, -10, 0],
            x: [0, 6, -4, 8, 0],
            rotate: [0, 8, -5, 10, 0],
          }}
          transition={{
            duration: 5 + i * 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        >
          {sticker}
        </motion.div>
      ))}
    </div>
  );
}