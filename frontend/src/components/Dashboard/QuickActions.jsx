import {
  CalendarDays,
  Car,
  ChevronRight,
  Coffee,
  Gift,
  Lightbulb,
  MessageCircle,
  Share2,
} from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  { label: "Share Plan", path: "/share", icon: Share2 },
  { label: "Open Chat", path: "/chat", icon: MessageCircle },
  { label: "View My Plans", path: "/my-plans", icon: CalendarDays },
  { label: "Browse Ideas", path: "/activities", icon: Lightbulb },
];

const planningActions = [
  { label: "Find a Cafe", path: "/cafes", icon: Coffee },
  { label: "Book a Ride", path: "/book-rides", icon: Car },
  { label: "Order Gifts", path: "/gifts", icon: Gift },
];

const QuickActions = () => {
  return (
    <section className="rounded-3xl border border-orange-100 bg-white/80 p-6 shadow-lg shadow-orange-100/60">
      <h2 className="text-2xl font-bold text-slate-950">Quick Actions</h2>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {actions.map(({ label, path, icon: Icon }, index) => (
          <Link
            key={label}
            to={path}
            className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-2xl border border-orange-50 bg-white p-4 text-center font-semibold text-slate-900 shadow-sm transition hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            <Icon
              size={25}
              className={index === 0 ? "text-orange-500" : "text-slate-950"}
            />
            {label}
          </Link>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {planningActions.map(({ label, path, icon: Icon }) => (
          <Link
            key={label}
            to={path}
            className="group flex items-center gap-4 rounded-2xl bg-slate-950 px-5 py-5 text-lg font-bold text-white shadow-md shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
          >
            <Icon size={25} className="shrink-0" />
            <span className="flex-1">{label}</span>
            <ChevronRight
              size={22}
              className="transition group-hover:translate-x-1"
            />
          </Link>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-linear-to-br from-orange-400 to-orange-300 p-5">
        <h3 className="text-xl font-black text-slate-950">Need ideas?</h3>
        <p className="mt-1 text-sm leading-6 text-slate-800">
          Discover date ideas for any mood.
        </p>
        <Link
          to="/activities"
          className="mt-4 inline-flex rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
        >
          Explore Ideas
        </Link>
      </div>
    </section>
  );
};

export default QuickActions;
