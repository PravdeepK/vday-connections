import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Connections - Valentine's Day Edition",
  description: "Find the four groups of four words that share a connection!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  );
}
