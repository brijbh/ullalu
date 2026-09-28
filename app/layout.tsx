import type { Metadata } from "next";
import "./globals.css";
import "./expansion-fix.css";
import "./day-note.css";

export const metadata: Metadata = {
  title: {
    default: "Ullalu",
    template: "%s · Ullalu",
  },
  description: "A visual travel planner built around time — travel, activities, reservations, free time, buffers, and rest in one realistic day.",
  applicationName: "Ullalu",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Ullalu — Plan travel in time, not just places.",
    description: "See travel, activities, reservations, free time, buffers, and rest as one realistic day.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ullalu — Plan travel in time, not just places.",
    description: "See travel, activities, reservations, free time, buffers, and rest as one realistic day.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
