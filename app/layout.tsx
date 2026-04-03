import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AnimatedBackgroundWrapper from "../components/AnimatedBackgroundWrapper";
import MotionProvider from "../components/MotionProvider";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SynapseChatbot } from "@/components/SynapseChatbot";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Atlas Synapse | Trust Engine for AI Systems",
  description:
    "Atlas Synapse is the trust layer for agentic AI — governance, verification, and auditability at the boundaries of your AI systems.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  }
};

function RootLayoutContent({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnimatedBackgroundWrapper />
      <MotionProvider>
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <main className="relative z-10">{children}</main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
        <SynapseChatbot />
      </MotionProvider>
    </>
  );
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans text-slate-100 antialiased`}
      >
        <Suspense fallback={<div className="min-h-screen" />}>
          <AuthProvider>
            <RootLayoutContent>{children}</RootLayoutContent>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}

