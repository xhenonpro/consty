"use client";

import React, { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import RequireAuth from "../../components/RequireAuth";

const AddEditArchitectModal = dynamic(() => import("../../components/AddEditArchitectModal"), { ssr: false });

interface Architect {
  id: number;
  name: string;
  project_id: number | null;
  email: string;
  phone: string;
}

export default function ArchitectsPage() {
  const [architects, setArchitects] = useState<Architect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editArchitect, setEditArchitect] = useState<Architect | null>(null);

  const fetchArchitects = () => {
    setLoading(true);
    fetch("http://localhost/consty/api/architects.php")
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || res.statusText || "Unknown error");
        }
        return res.json();
      })
      .then((d) => {
        setArchitects(d.architects || []);
        setLoading(false);
      })
      .catch((e) => {
        setError("Failed to load architects. " + (e.message || ""));
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchArchitects();
  }, []);

  const handleAddEdit = () => {
    setShowModal(false);
    setEditArchitect(null);
    fetchArchitects();
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-2 md:px-0">
      <RequireAuth />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-300">Architects</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl shadow transition text-lg"
          onClick={() => { setShowModal(true); setEditArchitect(null); }}
        >
          + Add Architect
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
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Project ID</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-blue-700 dark:text-blue-300">Loading...</td></tr>
            ) : architects.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">No architects found.</td></tr>
            ) : (
              architects.map((a) => (
                <tr key={a.id} className="hover:bg-blue-50 dark:hover:bg-blue-950 transition">
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">{a.name}</td>
                  <td className="px-6 py-4">{a.project_id || <span className="text-gray-400">-</span>}</td>
                  <td className="px-6 py-4">{a.email}</td>
                  <td className="px-6 py-4">{a.phone || <span className="text-gray-400">-</span>}</td>
                  <td className="px-6 py-4 text-center flex gap-2 justify-center">
                    <button
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-bold py-1 px-3 rounded-lg text-xs shadow transition"
                      title="Edit"
                      onClick={() => { setEditArchitect(a); setShowModal(true); }}
                    >Edit</button>
                    <button
                      className="bg-red-100 hover:bg-red-200 text-red-700 font-bold py-1 px-3 rounded-lg text-xs shadow transition"
                      title="Remove"
                      onClick={async () => {
                        if (confirm('Are you sure you want to remove this architect?')) {
                          await fetch('http://localhost/consty/api/architects.php', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: a.id }),
                          });
                          fetchArchitects();
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
        {showModal && <AddEditArchitectModal onClose={() => { setShowModal(false); setEditArchitect(null); }} onSave={handleAddEdit} architect={editArchitect} />}
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
