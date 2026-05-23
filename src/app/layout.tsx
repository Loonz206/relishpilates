import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Nunito_Sans, Press_Start_2P } from "next/font/google";
import "./globals.css";

const ttRamillas = localFont({
  src: "../../public/fonts/TT_Ramillas_Black.woff2",
  variable: "--font-tt-ramillas",
  weight: "900",
  style: "normal",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["300", "400"],
});

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  subsets: ["latin"],
  weight: "400",
});

export const viewport: Viewport = {
  themeColor: "#fbf2ea",
};

export const metadata: Metadata = {
  title: "Relish Pilates — Yummy, challenging, feel-good Pilates",
  description:
    "Virtual Pilates classes built entirely around you. With custom programming and personal attention, every movement connects to how you want to move and feel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ttRamillas.variable} ${nunitoSans.variable} ${pressStart.variable} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-light focus:text-dark focus:px-4 focus:py-2 focus:rounded-full focus:border focus:border-dark"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
