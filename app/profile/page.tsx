"use client";

import React, { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo: fetch user from localStorage or API
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("http://localhost/consty/api/profile.php", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-blue-700 dark:text-blue-300">Loading...</div>;

  if (!user) return <div className="min-h-screen flex items-center justify-center text-red-600">Not logged in.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-blue-950">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6 animate-fadeIn">
        <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-2 text-center">Profile</h1>
        <div className="flex flex-col gap-2 text-lg">
          <div><span className="font-bold">Username:</span> {user.username}</div>
          <div><span className="font-bold">Email:</span> {user.email}</div>
          <div><span className="font-bold">Role:</span> {user.role}</div>
        </div>
        <a href="/settings" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl shadow transition text-center">Settings</a>
        <button
          className="bg-red-100 hover:bg-red-200 text-red-700 font-bold py-2 px-6 rounded-xl shadow transition text-center"
          onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
        >Logout</button>
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }
      `}</style>
    </div>
  );
}
