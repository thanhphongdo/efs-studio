"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { EnglishVideoProvider } from "./store-provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <EnglishVideoProvider>{children}</EnglishVideoProvider>
      </body>
    </html>
  );
}
