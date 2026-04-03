'use client';

import dynamic from "next/dynamic";

const AboutPageClient = dynamic(
  () => import("./AboutPageClient"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 animate-pulse rounded-full bg-atlas-primary/40" />
      </div>
    ),
  }
);

export function AboutPageWrapper() {
  return <AboutPageClient />;
}
