import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || "http://localhost:5001"

const CafeReservation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const cafe = location.state?.cafe

  const [time, setTime] = useState('')

  if (!cafe) {
    return <p className="py-10">Cafe not found. Go back and select a cafe.</p>
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newPlan = {
      name: `${cafe.name} Date`,
      date: new Date().toISOString(),
      title: cafe.name,
      location: cafe.name,
      time: new Date(`2026-01-01T${time}`).toISOString(),
    }
    const token = localStorage.getItem("token");

    if (!token) {
    alert("Please login first");
    navigate("/login");
    return;
    }
    const res = await fetch(`${API}/api/plan/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      
      body: JSON.stringify(newPlan),
    });

    const data = await res.json()

    if (data.success) {
      alert("Plan saved to database!")
      navigate("/dashboard")
    } else {
      alert(data.message || "Failed to save plan")
    }
  }

  return (
    <section className="py-10 sm:py-14 lg:py-20">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow-lg">
        <img src={cafe.img} alt={cafe.name} className="h-56 w-full rounded-2xl object-cover" />

        <h1 className="mt-6 text-3xl font-black">{cafe.name}</h1>
        <p className="mt-2 text-sm">⏰ Open: {cafe.open}</p>
        <p className="text-sm">⏰ Close: {cafe.close}</p>
        <p className="mt-2 text-sm">⭐ {cafe.rating}</p>

        <form onSubmit={handleSubmit} className="mt-6">
          <label className="font-semibold">Reservation time</label>

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="mt-2 w-full rounded-xl border p-3"
          />

          <button className="mt-5 w-full rounded-full bg-slate-900 px-6 py-3 font-bold text-white">
            Add to Date Plan
          </button>
        </form>
      </div>
    </section>
  )
}

export default CafeReservation