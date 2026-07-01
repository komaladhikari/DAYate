import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "https://dayate-zw7n.onrender.com";

const getToday = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
};

const buildUberUrl = ({ cafe, pickup }) => {
  const params = new URLSearchParams({
    action: "setPickup",
    "pickup[nickname]": pickup || "Current location",
    "dropoff[nickname]": cafe.name,
  });

  if (pickup) {
    params.set("pickup[formatted_address]", pickup);
  } else {
    params.set("pickup", "my_location");
  }

  if (cafe.latitude && cafe.longitude) {
    params.set("dropoff[latitude]", cafe.latitude);
    params.set("dropoff[longitude]", cafe.longitude);
  }

  if (cafe.address) {
    params.set("dropoff[formatted_address]", cafe.address);
  }

  return `https://m.uber.com/ul/?${params.toString()}`;
};

const CafeReservation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cafe = location.state?.cafe;

  const [date, setDate] = useState(getToday);
  const [time, setTime] = useState("");
  const [pickup, setPickup] = useState("");
  const [uberOpened, setUberOpened] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!cafe) {
    return <p className="py-10">Restaurant not found. Go back and select one.</p>;
  }

  const selectedDateTime = date && time ? new Date(`${date}T${time}`) : null;
  const uberUrl = buildUberUrl({ cafe, pickup: pickup.trim() });

  const handleBookUber = () => {
    if (!time) {
      alert("Choose a time before booking your ride.");
      return;
    }

    window.open(uberUrl, "_blank", "noopener,noreferrer");
    setUberOpened(true);
  };

  const handleRideConfirmed = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

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
          activities: [
            {
              type: "restaurant",
              title: cafe.name,
              location: cafe.address || cafe.name,
              time: selectedDateTime.toISOString(),
              providerPlaceId: cafe.id,
              businessId: cafe.businessId || null,
              address: cafe.address,
              coordinates: {
                latitude: cafe.latitude,
                longitude: cafe.longitude,
              },
              mapsUrl: cafe.mapsUrl,
              rating: cafe.rating,
              reviewCount: cafe.reviewCount,
              priceLevel: cafe.priceLevel,
              bookingStatus: "pending",
            },
            {
              type: "ride",
              title: `Uber to ${cafe.name}`,
              from: pickup.trim() || "Current location",
              to: cafe.address || cafe.name,
              location: cafe.address || cafe.name,
              time: selectedDateTime.toISOString(),
              mapsUrl: uberUrl,
              bookingStatus: "confirmed",
            },
          ],
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Ride and restaurant added to your date plan!");
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
        <img
          src={cafe.img}
          alt={cafe.name}
          onError={(event) => {
            if (cafe.fallbackImage) {
              event.currentTarget.src = cafe.fallbackImage;
            }
          }}
          className="h-56 w-full rounded-2xl object-cover"
        />
        {cafe.photoAttributions?.length > 0 && (
          <p className="mt-2 text-xs text-slate-500">
            Photo by{" "}
            {cafe.photoAttributions.map((attribution, position) => (
              <span key={`${cafe.id}-${attribution.displayName}`}>
                {position > 0 && ", "}
                {attribution.uri ? (
                  <a
                    href={attribution.uri}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    {attribution.displayName}
                  </a>
                ) : (
                  attribution.displayName
                )}
              </span>
            ))}
          </p>
        )}

        <h1 className="mt-6 text-3xl font-black">{cafe.name}</h1>
        <p className="mt-2 text-sm text-slate-600">{cafe.address}</p>
        <p className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-black ${
          cafe.isRegistered
            ? "bg-emerald-50 text-emerald-700"
            : "bg-orange-50 text-orange-600"
        }`}>
          {cafe.isRegistered
            ? "DAYate registered partner"
            : "Location API suggestion"}
        </p>
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

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleBookUber();
          }}
          className="mt-6 space-y-4"
        >
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

          <label className="block font-semibold">
            Pickup location
            <input
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Leave blank to use current location in Uber"
              className="mt-2 w-full rounded-xl border p-3 font-normal"
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-slate-900 px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Book Uber
          </button>
        </form>

        {uberOpened && (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <p className="font-semibold text-rose-950">
              Finished confirming your Uber?
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Tap below after booking so the ride appears in this date plan.
            </p>
            <button
              type="button"
              onClick={handleRideConfirmed}
              disabled={saving}
              className="mt-4 w-full rounded-full bg-rose-500 px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving ride..." : "I booked my ride"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CafeReservation;
