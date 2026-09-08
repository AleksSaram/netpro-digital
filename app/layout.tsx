import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "NetPro Digital Studio",
  description: "Global Digital Studio & Strategy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`scroll-smooth ${jakarta.variable} ${mono.variable}`}>
      <body className="bg-[#f8f9fc] text-[#111113] font-sans antialiased selection:bg-[#ff2a2a] selection:text-white">
        {children}
      </body>
    </html>
  );
}