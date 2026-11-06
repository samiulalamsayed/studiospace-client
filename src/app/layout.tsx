import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "StudioSpace | Creative Spaces, Unlimited Possibilities",
    template: "%s | StudioSpace",
  },
  description:
    "Discover and book inspiring creative studios, photography spaces, podcast rooms, music suites, and production workspaces.",
  keywords: [
    "StudioSpace",
    "Studio Rental",
    "Photography Studio",
    "Podcast Studio",
    "Creative Workspace",
    "Music Studio",
  ],
  applicationName: "StudioSpace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${plusJakarta.variable} antialiased`}
      >
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="min-h-screen">{children}</main>

        {/* Footer */}
        <Footer />

        {/* Global Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}