"use client";

import React, { useEffect, useState } from "react";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
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
        setEmail(data.user.email);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await fetch("http://localhost/consty/api/settings.php", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to update settings.");
      return;
    }
    setSuccess("Settings updated successfully.");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-blue-700 dark:text-blue-300">Loading...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center text-red-600">Not logged in.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-blue-950">
      <form onSubmit={handleSave} className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6 animate-fadeIn">
        <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-2 text-center">Settings</h1>
        {success && <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded-lg text-center">{success}</div>}
        {error && <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-center">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password (leave blank to keep)"
          className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow transition text-lg disabled:opacity-60"
        >
          Save Changes
        </button>
      </form>
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
