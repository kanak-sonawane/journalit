import type { Metadata } from "next";
import { Caveat, Nunito, Playfair_Display, Special_Elite } from "next/font/google";
import "./globals.css";

const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const specialElite = Special_Elite({ weight: "400", subsets: ["latin"], variable: "--font-special-elite" });

export const metadata: Metadata = {
  title: "Scrappy",
  description: "Your digital scrapbook journal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${caveat.variable} ${nunito.variable} ${playfair.variable} ${specialElite.variable}`}>
        {children}
      </body>
    </html>
  );
}