/**
 * Fonts are downloaded at BUILD time by next/font and self-hosted from our
 * own origin — the user's browser never contacts Google (privacy requirement:
 * no third-party requests on any page).
 */
import { Inter, Space_Grotesk, Vazirmatn } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

/** Vazirmatn: excellent Arabic-script coverage, designed for Persian/Dari. */
export const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const fontVariables = `${inter.variable} ${spaceGrotesk.variable} ${vazirmatn.variable}`;
