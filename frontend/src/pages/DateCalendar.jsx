import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  X,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001";
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const dateKey = (value) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const DateCalendar = () => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("token");

    fetch(`${API}/api/chat/calendar`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) {
          throw new Error(data.message || "Could not load your date calendar");
        }

        setDates(data.data);

        if (data.data.length > 0) {
          const firstDate = new Date(data.data[0].date);
          setVisibleMonth(new Date(firstDate.getFullYear(), firstDate.getMonth(), 1));
          setSelectedDate(dateKey(firstDate));
        }
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Could not load your date calendar");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const plansByDate = useMemo(
    () =>
      dates.reduce((grouped, plan) => {
        const key = dateKey(plan.date);
        grouped[key] = grouped[key] || [];
        grouped[key].push(plan);
        return grouped;
      }, {}),
    [dates]
  );

  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return [
      ...Array(firstDay).fill(null),
      ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1)),
    ];
  }, [visibleMonth]);

  const selectedPlans = selectedDate ? plansByDate[selectedDate] || [] : [];

  const changeMonth = (offset) => {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + offset, 1)
    );
    setSelectedDate(null);
  };

  return (
    <main className="min-h-screen bg-[#ffbf8b] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center gap-4">
          <span className="rounded-2xl bg-white p-4 text-orange-600 shadow-sm">
            <CalendarDays size={30} />
          </span>
          <div>
            <h1 className="text-4xl font-black text-slate-950">Date Calendar</h1>
            <p className="mt-1 text-slate-700">
              Select a month and date to open your shared memories.
            </p>
          </div>
        </header>

        {error && (
          <p role="alert" className="mb-6 rounded-2xl bg-red-50 px-5 py-4 text-red-700">
            {error}
          </p>
        )}

        {loading ? (
          <div className="h-[620px] animate-pulse rounded-3xl bg-white/70" />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section className="rounded-3xl border border-orange-200 bg-white p-4 shadow-lg shadow-orange-900/10 sm:p-6">
              <header className="mb-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => changeMonth(-1)}
                  className="rounded-full border border-orange-200 p-2.5 text-slate-800 transition hover:bg-orange-50"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={22} />
                </button>
                <h2 className="text-2xl font-black text-slate-950">
                  {visibleMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <button
                  type="button"
                  onClick={() => changeMonth(1)}
                  className="rounded-full border border-orange-200 p-2.5 text-slate-800 transition hover:bg-orange-50"
                  aria-label="Next month"
                >
                  <ChevronRight size={22} />
                </button>
              </header>

              <div className="grid grid-cols-7 gap-1 text-center sm:gap-2">
                {weekDays.map((day) => (
                  <div key={day} className="py-2 text-xs font-bold uppercase text-slate-500">
                    {day}
                  </div>
                ))}

                {calendarDays.map((day, index) => {
                  if (!day) {
                    return <div key={`empty-${index}`} />;
                  }

                  const key = dateKey(day);
                  const plans = plansByDate[key] || [];
                  const memoryCount = plans.reduce(
                    (total, plan) => total + plan.images.length,
                    0
                  );
                  const isSelected = selectedDate === key;
                  const isToday = dateKey(new Date()) === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedDate(key)}
                      className={`relative min-h-20 rounded-2xl border p-2 text-left transition sm:min-h-24 ${
                        isSelected
                          ? "border-orange-500 bg-orange-100 shadow-sm"
                          : plans.length > 0
                            ? "border-orange-200 bg-orange-50 hover:border-orange-400"
                            : "border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                          isToday ? "bg-slate-950 text-white" : "text-slate-800"
                        }`}
                      >
                        {day.getDate()}
                      </span>
                      {memoryCount > 0 && (
                        <span className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1 rounded-full bg-orange-500 px-1.5 py-1 text-[10px] font-bold text-white sm:text-xs">
                          <ImageIcon size={12} />
                          {memoryCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            <aside className="rounded-3xl border border-orange-200 bg-white p-5 shadow-lg shadow-orange-900/10">
              <h2 className="text-xl font-black text-slate-950">
                {selectedDate
                  ? new Date(
                      Number(selectedDate.split("-")[0]),
                      Number(selectedDate.split("-")[1]),
                      Number(selectedDate.split("-")[2])
                    ).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })
                  : "Select a date"}
              </h2>

              {selectedPlans.length > 0 ? (
                <div className="mt-5 space-y-6">
                  {selectedPlans.map((plan) => (
                    <section key={plan._id}>
                      <h3 className="font-bold text-slate-800">{plan.name}</h3>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {plan.images.map((image) => (
                          <button
                            key={image._id}
                            type="button"
                            onClick={() => setSelectedImage({ ...image, planName: plan.name })}
                            className="group overflow-hidden rounded-xl bg-slate-100"
                          >
                            <img
                              src={image.imageUrl}
                              alt={image.text || `Memory from ${plan.name}`}
                              className="h-28 w-full object-cover transition group-hover:scale-105"
                            />
                          </button>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="mt-8 text-center text-slate-500">
                  <ImageIcon className="mx-auto text-orange-300" size={36} />
                  <p className="mt-3 text-sm">
                    {selectedDate
                      ? "No shared memories on this date."
                      : "Choose a highlighted date to view its pictures."}
                  </p>
                </div>
              )}
            </aside>
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setSelectedImage(null)}
          role="presentation"
        >
          <div onClick={(event) => event.stopPropagation()} role="presentation" className="relative">
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white"
              aria-label="Close image"
            >
              <X size={22} />
            </button>
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.text || selectedImage.planName}
              className="max-h-[82vh] max-w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default DateCalendar;
