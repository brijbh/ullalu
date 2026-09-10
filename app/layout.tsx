import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ullalu",
  description: "Visual time planning for travel",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
