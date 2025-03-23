import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/AppLayout";
import ReactQueryClientWrapper from "@/components/ReactQueryClientWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KeyMap",
  description: "AI-powered database schema generation for your app ideas—fast and effortless.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="prefetch"
          href="/sprite.svg"
          as="image"
          type="image/svg+xml"
        ></link>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryClientWrapper>
          <AppLayout>{children}</AppLayout>
        </ReactQueryClientWrapper>
      </body>
    </html>
  );
}
