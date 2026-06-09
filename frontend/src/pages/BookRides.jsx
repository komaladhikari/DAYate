import React, { useState } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BookRides = () => {
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const [form, setForm] = useState({
    from: "",
    to: "",
    time: "",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/plan/add`,
        {
          name: "Ride Booking",
          date: new Date().toISOString(),
          title: "Ride",
          type: "ride",
          from: form.from,
          to: form.to,
          time: form.time,
          location: form.to,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Ride booked successfully!");
        navigate("/my-planned-dates");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to book ride");
    }
  };

  return (
    <section className="py-10 sm:py-14 lg:py-20">
      <h1 className="text-4xl font-black mb-8">Book Rides</h1>

      <div className="grid gap-8 lg:grid-cols-2 items-center">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
          <label className="block">
            <span className="text-slate-700 mb-2 block">From</span>
            <input
              name="from"
              value={form.from}
              onChange={handleChange}
              placeholder="Pickup location"
              required
              className="w-full rounded-2xl bg-[#ffd6b8] px-4 py-4 outline-none"
            />
          </label>

          <label className="block">
            <span className="text-slate-700 mb-2 block">To</span>
            <input
              name="to"
              value={form.to}
              onChange={handleChange}
              placeholder="Destination"
              required
              className="w-full rounded-2xl bg-[#ffd6b8] px-4 py-4 outline-none"
            />
          </label>

          <label className="block">
            <span className="text-slate-700 mb-2 block">Time</span>
            <input
              name="time"
              value={form.time}
              onChange={handleChange}
              type="time"
              required
              className="w-full rounded-2xl bg-[#ffd6b8] px-4 py-4 outline-none"
            />
          </label>

          <button
            type="submit"
            className="mt-2 inline-block rounded-full bg-linear-to-r from-rose-500 to-amber-400 px-6 py-3 text-white font-semibold"
          >
            Book Ride
          </button>
        </form>

        <div className="rounded-2xl overflow-hidden bg-white p-6 shadow-lg">
          <img
            src={assets.image2}
            alt="map placeholder"
            className="w-full h-72 object-cover rounded-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default BookRides;
