"use client";

import React, { useState, useEffect } from "react";

export default function AddEditEmployeeModal({ onClose, onSave, employee }: { onClose: () => void; onSave: () => void; employee: any }) {
  const [name, setName] = useState(employee?.name || "");
  const [salary, setSalary] = useState(employee?.salary || "");
  const [projectId, setProjectId] = useState(employee?.project_id || "");
  const [email, setEmail] = useState(employee?.email || "");
  const [phone, setPhone] = useState(employee?.phone || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(employee?.name || "");
    setSalary(employee?.salary || "");
    setProjectId(employee?.project_id || "");
    setEmail(employee?.email || "");
    setPhone(employee?.phone || "");
  }, [employee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const method = employee ? "PATCH" : "POST";
    const body = employee
      ? { id: employee.id, name, salary, project_id: projectId, email, phone }
      : { name, salary, project_id: projectId, email, phone };
    const res = await fetch("http://localhost/consty/api/employees.php", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Failed to save employee.");
      return;
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500">&times;</button>
        <h2 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-300">{employee ? "Edit Employee" : "Add Employee"}</h2>
        {error && <div className="mb-4 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Salary"
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
            value={salary}
            onChange={e => setSalary(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Project ID"
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone"
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl shadow transition text-lg disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (employee ? "Saving..." : "Adding...") : (employee ? "Save Changes" : "Add Employee")}
          </button>
        </form>
      </div>
    </div>
  );
}
