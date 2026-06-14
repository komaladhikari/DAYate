import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "https://dayate-zw7n.onrender.com";

const getToday = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
};

const CafeReservation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cafe = location.state?.cafe;

  const [date, setDate] = useState(getToday);
  const [time, setTime] = useState("");
  const [saving, setSaving] = useState(false);

  if (!cafe) {
    return <p className="py-10">Restaurant not found. Go back and select one.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const selectedDateTime = new Date(`${date}T${time}`);
    const planDate = new Date(`${date}T00:00:00`);

    setSaving(true);

    try {
      const res = await fetch(`${API}/api/plan/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: `${cafe.name} Date`,
          date: planDate.toISOString(),
          type: "restaurant",
          title: cafe.name,
          location: cafe.address || cafe.name,
          time: selectedDateTime.toISOString(),
          providerPlaceId: cafe.id,
          address: cafe.address,
          coordinates: {
            latitude: cafe.latitude,
            longitude: cafe.longitude,
          },
          mapsUrl: cafe.mapsUrl,
          rating: cafe.rating,
          reviewCount: cafe.reviewCount,
          priceLevel: cafe.priceLevel,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Restaurant added to your date plan!");
        navigate("/my-plans");
      } else {
        alert(data.message || "Failed to save plan");
      }
    } catch {
      alert("Failed to save plan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="py-10 sm:py-14 lg:py-20">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow-lg">
        <img src={cafe.img} alt={cafe.name} className="h-56 w-full rounded-2xl object-cover" />

        <h1 className="mt-6 text-3xl font-black">{cafe.name}</h1>
        <p className="mt-2 text-sm text-slate-600">{cafe.address}</p>
        <p className="mt-2 text-sm">
          {cafe.rating
            ? `${cafe.rating}/5 (${cafe.reviewCount} reviews)`
            : "No ratings yet"}
        </p>
        {cafe.mapsUrl && (
          <a
            href={cafe.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm font-semibold text-rose-500"
          >
            View on Google Maps
          </a>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block font-semibold">
            Date
            <input
              type="date"
              min={getToday()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border p-3 font-normal"
            />
          </label>

          <label className="block font-semibold">
            Time
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border p-3 font-normal"
            />
          </label>

          <button
            disabled={saving}
            className="w-full rounded-full bg-slate-900 px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Adding..." : "Add to Date Plan"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CafeReservation;
