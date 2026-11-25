"use client";
import React, { useState } from "react";
import { addDoc, deleteDoc, doc } from "firebase/firestore";
import useVisitorItems from "./useVisitorItems";
export default function Home() {
  const { items, loading, busy, error, mutate } = useVisitorItems("items");
  const [formData, setFormData] = useState({ name: "", price: "" });
  const { name, price } = formData;
  const total = items.reduce((sum, item) => sum + Number(item.price), 0).toFixed(2);
  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const addItem = async e => {
    e.preventDefault();
    const amount = Number(price);
    if (!name.trim() || name.trim().length > 120 || !Number.isFinite(amount) || amount <= 0 || amount > 1000000000) return;
    if (await mutate(ref => addDoc(ref, { name: name.trim(), price: Math.round(amount * 100) / 100 }))) {
      setFormData({ name: "", price: "" });
    }
  };
  const deleteItem = id => mutate(ref => deleteDoc(doc(ref, id)));
  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl p-4 text-center">Expense tracker</h1>
        <p role="status" className="pb-4">{loading ? "Connecting…" : "Your personal demo expenses. Saved in this browser’s guest account."}</p>
        {error && <p role="alert" className="pb-4">{error}</p>}
        <div className="bg-slate-800 p-4 rounded-lg">
          <form
            className="grid grid-cols-6 items-center text-black"
            onSubmit={addItem}
          >
            <input
              className="col-span-3 p-3 border"
              type="text"
              placeholder="Enter Item" aria-label="Expense name" maxLength={120} required
              value={name}
              onChange={handleChange}
              name="name"
            />
            <input
              className="col-span-2 p-3 border mx-3"
              type="number"
              placeholder="Enter $" aria-label="Amount in dollars" min="0.01" max="1000000000" step="0.01" required
              value={price}
              onChange={handleChange}
              name="price"
            />
            <button
              type="submit" disabled={loading || busy} aria-label="Add expense"
              className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl"
            >
              +
            </button>
          </form>
          <ul>
            {items.map((item, id) => (
              <li
                key={item.id}
                className="my-4 w-full flex justify-between bg-slate-950"
              >
                <div className="p-4 w-full flex justify-between">
                  <span className="capitalize">{item.name}</span>
                  <span>${item.price}</span>
                </div>
                <button
                  disabled={loading || busy} aria-label={`Delete ${item.name}`} onClick={() => deleteItem(item.id)}
                  className="ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          {items.length < 1 ? (
            ""
          ) : (
            <div className="flex justify-between p-3">
              <span>Total</span>
              <span>${total}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
