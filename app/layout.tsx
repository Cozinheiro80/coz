import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import type { ReactNode } from "react";
import AppShell from "./components/app-shell";
import "./globals.css";
import { cn } from "@/lib/utils";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio - Ivan Lilla",
  description:
    "This is my portfolio, where I share my projects, skills, and journey as a developer. Discover my work, the technologies I use, and how to contact me to collaborate or discuss new opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={cn("font-sans", figtree.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
