import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Budiman Cendikia",
  description: "Portal Pendidikan Budiman Cendikia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <style dangerouslySetInnerHTML={{__html: `
          body { background-color: #C8F7F5 !important; }
          .bg-main { background-color: #C8F7F5 !important; }
          .bg-navbar { background-color: #0FA8A4 !important; }
          .text-title { color: #0B6B69 !important; }
        `}} />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}
