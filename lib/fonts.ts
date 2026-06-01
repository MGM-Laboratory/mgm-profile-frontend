// Brand typefaces, self-hosted via next/font (no layout shift, no FOUT).
// Bricolage Grotesque = display, Geist = UI, Geist Mono = mono.
// Each exposes a CSS variable consumed by the @theme families in globals.css.
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";

export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

export const geist = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-geist",
  display: "swap",
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-geist-mono",
  display: "swap",
});

/** Space-separated font CSS variables to attach to <html>. */
export const fontVariables = `${bricolage.variable} ${geist.variable} ${geistMono.variable}`;
