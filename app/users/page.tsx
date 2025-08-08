"use client";

import React, { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const AddEditUserModal = dynamic(() => import("../../components/AddEditUserModal"), { ssr: false });

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
    if (role !== "admin") {
      setForbidden(true);
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    fetch("http://localhost/consty/api/users.php")
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || res.statusText || "Unknown error");
        }
        return res.json();
      })
      .then((d) => {
        setUsers(d.users || []);
        setLoading(false);
      })
      .catch((e) => {
        setError("Failed to load users. " + (e.message || ""));
        setLoading(false);
      });
  };

  const handleAddEdit = () => {
    setShowModal(false);
    setEditUser(null);
    fetchUsers();
  };

  if (forbidden) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl text-red-600 font-bold">403 Forbidden</div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-2 md:px-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-300">Users</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl shadow transition text-lg"
          onClick={() => { setShowModal(true); setEditUser(null); }}
        >
          + Add User
        </button>
      </div>
      {error && (
        <div className="mb-6 flex items-center justify-between bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg shadow relative animate-fadeIn">
          <span>{error}</span>
          <button onClick={() => setError("")} className="ml-4 text-xl font-bold leading-none hover:text-red-900">&times;</button>
        </div>
      )}
      <div className="overflow-x-auto rounded-2xl shadow-lg bg-white dark:bg-gray-900">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-blue-50 dark:bg-blue-950">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Password (hashed)</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-blue-700 dark:text-blue-300">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No users found.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-blue-50 dark:hover:bg-blue-950 transition">
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">{u.username}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4 font-mono text-xs break-all">{u.password}</td>
                  <td className="px-6 py-4">{u.role}</td>
                  <td className="px-6 py-4">{u.created_at}</td>
                  <td className="px-6 py-4 text-center flex gap-2 justify-center">
                    <button
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-bold py-1 px-3 rounded-lg text-xs shadow transition"
                      title="Edit"
                      onClick={() => { setEditUser(u); setShowModal(true); }}
                    >Edit</button>
                    <button
                      className="bg-red-100 hover:bg-red-200 text-red-700 font-bold py-1 px-3 rounded-lg text-xs shadow transition"
                      title="Remove"
                      onClick={async () => {
                        if (confirm('Are you sure you want to remove this user?')) {
                          await fetch('http://localhost/consty/api/users.php', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: u.id }),
                          });
                          fetchUsers();
                        }
                      }}
                    >Remove</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Suspense fallback={null}>
        {showModal && <AddEditUserModal onClose={() => { setShowModal(false); setEditUser(null); }} onSave={handleAddEdit} user={editUser} />}
      </Suspense>
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
