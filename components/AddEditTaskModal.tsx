"use client";

import React, { useState, useEffect } from "react";

export default function AddEditTaskModal({ onClose, onSave, task }: { onClose: () => void; onSave: () => void; task: any }) {
  const [name, setName] = useState(task?.name || "");
  const [projectId, setProjectId] = useState(task?.project_id || "");
  const [deadline, setDeadline] = useState(task?.deadline || "");
  const [status, setStatus] = useState(task?.status || "pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(task?.name || "");
    setProjectId(task?.project_id || "");
    setDeadline(task?.deadline || "");
    setStatus(task?.status || "pending");
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const method = task ? "PATCH" : "POST";
    const body = task
      ? { id: task.id, name, project_id: projectId, deadline, status }
      : { name, project_id: projectId, deadline, status };
    const res = await fetch("http://localhost/consty/api/tasks.php", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Failed to save task.");
      return;
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500">&times;</button>
        <h2 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-300">{task ? "Edit Task" : "Add Task"}</h2>
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
            placeholder="Project ID"
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
          />
          <input
            type="date"
            placeholder="Deadline"
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
          />
          <select
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl shadow transition text-lg disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (task ? "Saving..." : "Adding...") : (task ? "Save Changes" : "Add Task")}
          </button>
        </form>
      </div>
    </div>
  );
}
