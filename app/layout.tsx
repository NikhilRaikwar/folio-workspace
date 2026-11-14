import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Folio — A little space for your next big idea",
  description: "Write, organize, and share your team's documents in one thoughtful workspace.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
