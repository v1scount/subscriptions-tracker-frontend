import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Subs Tracker",
  description: "Track your subscriptions",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// This root layout is a pass-through for the [lang] layout
// The actual html/body structure is defined in [lang]/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
