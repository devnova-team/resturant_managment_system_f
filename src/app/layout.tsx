import type { Metadata } from "next";

import AppProviders from "@/providers/AppProviders";

import "./globals.css";

export const metadata: Metadata = {
  title: "Restaurant Management System",
  description: "Restaurant management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
