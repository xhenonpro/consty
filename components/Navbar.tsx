"use client";

import React, { useEffect, useState } from "react";

const navLinks = [
  { name: "Architects", href: "/consty/architects" },
  { name: "Projects", href: "/consty/projects" },
  { name: "Machines", href: "/consty/machines" },
  { name: "Materials", href: "/consty/materials" },
  { name: "Employees", href: "/consty/employees" },
  { name: "Tasks", href: "/consty/tasks" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [userMenu, setUserMenu] = React.useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    setIsSignedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-gradient-to-r from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 backdrop-blur shadow flex items-center justify-between px-4 md:px-8 h-16 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <img src="/consty.png" alt="Logo" className="h-9 w-9 rounded-full shadow-lg" />
          <span className="font-extrabold text-2xl text-blue-700 dark:text-blue-300 tracking-tight drop-shadow">Consty</span>
        </div>
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-lg px-3 py-1 rounded transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              {link.name}
            </a>
          ))}
          {isSignedIn && (
            <a href="/consty/users" className="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-lg px-3 py-1 rounded transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/30">Users</a>
          )}
          {/* User Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-3 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-100 font-semibold focus:outline-none"
              onClick={() => setUserMenu((v) => !v)}
            >
              <span>User</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {userMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-lg z-50">
                {isSignedIn ? (
                  <>
                    <a href="/consty/profile" className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-100">Profile</a>
                    <a href="/consty/settings" className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-100">Settings</a>
                    <a href="#" className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-red-600 dark:text-red-400" onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}>Logout</a>
                  </>
                ) : (
                  <>
                    <a href="/consty/login" className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300">Sign In</a>
                    <a href="/consty/signup" className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-green-700 dark:text-green-400">Sign Up</a>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
        <div className="md:hidden flex items-center">
          <button
            className="p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-7 h-7 text-blue-700 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>
      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 flex">
          <div className="w-64 bg-white dark:bg-gray-900 h-full shadow-2xl p-6 flex flex-col animate-slideInLeft">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <img src="/assets/images/logo.svg" alt="Logo" className="h-8 w-8 rounded-full" />
                <span className="font-bold text-xl text-blue-700 dark:text-blue-300">Consty</span>
              </div>
              <button
                className="p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 focus:outline-none"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <svg className="w-6 h-6 text-blue-700 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-lg px-2 py-2 rounded transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              {isSignedIn && (
                <a href="/users" className="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-lg px-2 py-2 rounded transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/30" onClick={() => setMobileOpen(false)}>Users</a>
              )}
              {/* User Dropdown for mobile */}
              <div className="mt-4 border-t border-gray-200 dark:border-gray-800 pt-2">
                {isSignedIn ? (
                  <>
                    <a href="/consty/profile" className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-100">Profile</a>
                    <a href="/consty/settings" className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-100">Settings</a>
                    <a href="#" className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-red-600 dark:text-red-400" onClick={() => { localStorage.removeItem("token"); window.location.href = "/consty/login"; }}>Logout</a>
                  </>
                ) : (
                  <>
                    <a href="/consty/login" className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300">Sign In</a>
                    <a href="/consty/signup" className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-green-700 dark:text-green-400">Sign Up</a>
                  </>
                )}
              </div>
            </nav>
          </div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}
      <style jsx global>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.25s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </>
  );
}
