"use client";

import React, { useState, useEffect } from "react";

export default function AddEditMaterialModal({ onClose, onSave, material }: { onClose: () => void; onSave: () => void; material: any }) {
  const [name, setName] = useState(material?.name || "");
  const [quantity, setQuantity] = useState(material?.quantity || "");
  const [price, setPrice] = useState(material?.price || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(material?.name || "");
    setQuantity(material?.quantity || "");
    setPrice(material?.price || "");
  }, [material]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const method = material ? "PATCH" : "POST";
    const body = material
      ? { id: material.id, name, quantity, price }
      : { name, quantity, price };
    const res = await fetch("http://localhost/consty/api/materials.php", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Failed to save material.");
      return;
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500">&times;</button>
        <h2 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-300">{material ? "Edit Material" : "Add Material"}</h2>
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
            placeholder="Quantity"
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Price"
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl shadow transition text-lg disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (material ? "Saving..." : "Adding...") : (material ? "Save Changes" : "Add Material")}
          </button>
        </form>
      </div>
    </div>
  );
}
