import { Link } from "react-router-dom";
import { assets } from "../assets/assets.js";

const steps = [
  "Pick a restaurant",
  "Tap Book Uber",
  "Confirm the ride in Uber",
  "Tap I booked my ride",
  "See the ride in your plan",
];

const BookRides = () => {
  return (
    <section className="min-h-screen bg-[#fff7ef] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#ff6b1a]">
            Phase 1 Ride Flow
          </p>

          <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
            Book the ride after you choose the restaurant.
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            For now, DAYate opens Uber for the selected restaurant, then you
            confirm once the ride is booked so it can appear in your date plan.
          </p>

          <div className="mt-8 space-y-3">
            {steps.map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <span className="font-semibold text-slate-800">{step}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/cafes"
              className="inline-flex justify-center rounded-full bg-slate-950 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
            >
              Choose Restaurant
            </Link>
            <Link
              to="/my-plans"
              className="inline-flex justify-center rounded-full border border-[#ff9847] px-6 py-3 font-bold text-[#d76c1d] transition hover:bg-orange-50"
            >
              View My Plans
            </Link>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-lg">
          <img
            src={assets.image2}
            alt="DAYate ride planning"
            className="h-80 w-full rounded-2xl object-cover"
          />
          <div className="mt-5 rounded-2xl bg-rose-50 p-4">
            <p className="font-bold text-slate-950">Where the Uber button lives</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Go to Restaurants, pick a place, then the restaurant detail page
              will show the Book Uber and I booked my ride buttons.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookRides;
