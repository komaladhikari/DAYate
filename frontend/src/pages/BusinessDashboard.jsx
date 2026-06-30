import { CalendarDays, Coffee, Store } from "lucide-react";

const BusinessDashboard = () => {
  const name = localStorage.getItem("accountName") || "Business";

  return (
    <section className="min-h-[calc(100vh-90px)] bg-white px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-500">
              Business
            </p>
            <h1 className="mt-2 text-4xl font-black text-slate-950">
              Welcome, {name}
            </h1>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white">
            <Store size={28} />
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <Store className="text-orange-500" size={26} />
            <h2 className="mt-4 text-lg font-black text-slate-950">
              Profile
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-600">
              Keep restaurant or cafe details ready for customers.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <CalendarDays className="text-orange-500" size={26} />
            <h2 className="mt-4 text-lg font-black text-slate-950">
              Reservations
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-600">
              A home for bookings and availability in the next build step.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <Coffee className="text-orange-500" size={26} />
            <h2 className="mt-4 text-lg font-black text-slate-950">
              Offers
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-600">
              Highlight date-night specials for DAYate users.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessDashboard;
