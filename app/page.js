"use client";
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDoc,
  querySnapshot,
  query,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "./firebase";
export default function Home() {
  const [items, setItems] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
  });

  const { name, price } = formData;

  const [total, setTotal] = useState(0);
  // ADD Item to the data base
  // Read items from the database and delete data from the database

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!name || !price) {
      toast.error("You need to enter a value into both fields");
      return;
    }
    const newItem = { name, price };
    await addDoc(collection(db, "items"), {
      name: newItem.name.trim(),
      price: newItem.price,
    });
    setFormData({
      name: "",
      price: "",
    });
  };

  useEffect(() => {
    const q = query(collection(db, "items"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];
      querySnapshot.forEach((doc) =>
        itemsArr.push({ ...doc.data(), id: doc.id })
      );
      setItems(itemsArr);

      const calculateTotal = () => {
        const totalPrice = itemsArr.reduce(
          (sum, item) => sum + parseFloat(item.price),
          0
        );
        setTotal(totalPrice);
      };
      calculateTotal();
      return () => unsubscribe();
    });
  }, []);

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "items", id));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl p-4 text-center">Expense tracker</h1>
        <div className="bg-slate-800 p-4 rounded-lg">
          <form
            className="grid grid-cols-6 items-center text-black"
            onSubmit={addItem}
          >
            <input
              className="col-span-3 p-3 border"
              type="text"
              placeholder="Enter Item"
              value={name}
              onChange={handleChange}
              name="name"
            />
            <input
              className="col-span-2 p-3 border mx-3"
              type="number"
              placeholder="Enter $"
              value={price}
              onChange={handleChange}
              name="price"
            />
            <button
              type="submit"
              className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl"
            >
              +
            </button>
          </form>
          <ul>
            {items.map((item, id) => (
              <li
                key={id}
                className="my-4 w-full flex justify-between bg-slate-950"
              >
                <div className="p-4 w-full flex justify-between">
                  <span className="capitalize">{item.name}</span>
                  <span>${item.price}</span>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
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
