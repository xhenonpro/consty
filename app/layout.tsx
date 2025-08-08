"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Consty",
//   description: "Created By Xhenvolt Uganda Limited",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(true); // default true for SSR hydration
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    // Allow free access to /login and /signup regardless of user state
    const isAuthPage =
      pathname === "/login" ||
      pathname === "/signup" ||
      pathname === "/(auth)/login" ||
      pathname === "/(auth)/signup";
    // if (!token) {
    //   if (!isAuthPage) {
    //     setIsSignedIn(false);
    //   }
    //   router.push("/login");
    // } else {
    //   setIsSignedIn(true);
    // }
  }, [pathname, router]);
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/(auth)/login" ||
    pathname === "/(auth)/signup";
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-blue-950 text-gray-900 dark:text-gray-100">
          <div className="flex flex-1">
            {isSignedIn && !isAuthPage && <Sidebar />}
            <div className="flex-1 flex flex-col min-h-screen">
              {isSignedIn && !isAuthPage && <Navbar />}
              <main className="flex-1 p-4 md:p-8">{children}</main>
              <Footer />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
