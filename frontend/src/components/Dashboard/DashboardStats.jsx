import { CalendarDays, Check, Clock3, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

const statItems = [
  {
    key: "created",
    label: "Plans Created",
    path: "/my-plans",
    icon: CalendarDays,
    iconClass: "bg-blue-50 text-blue-600",
  },
  {
    key: "upcoming",
    label: "Upcoming",
    path: "/my-plans",
    icon: Clock3,
    iconClass: "bg-orange-50 text-orange-500",
  },
  {
    key: "completed",
    label: "Completed",
    path: "/planned-dates",
    icon: Check,
    iconClass: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "shared",
    label: "Shared Plans",
    path: "/share",
    icon: Share2,
    iconClass: "bg-rose-50 text-rose-500",
  },
];

const DashboardStats = ({ stats, loading, unavailable }) => {
  return (
    <section
      className="mt-6 rounded-3xl border border-orange-100 bg-white/80 p-6 shadow-lg shadow-orange-100/50"
      aria-busy={loading}
    >
      <h2 className="text-2xl font-bold text-slate-950">Your Activity</h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statItems.map(({ key, label, path, icon: Icon, iconClass }, index) => (
          <Link
            key={key}
            to={path}
            className={`group flex items-center gap-4 rounded-2xl p-4 transition hover:bg-orange-50/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
              index > 0 ? "xl:border-l xl:border-orange-100" : ""
            }`}
          >
            <span
              className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-full ${iconClass}`}
            >
              <Icon size={23} aria-hidden="true" />
            </span>

            <span>
              {loading ? (
                <span className="block h-8 w-10 animate-pulse rounded-lg bg-slate-200" />
              ) : (
                <strong className="block text-3xl font-black text-slate-950">
                  {unavailable ? "–" : stats[key]}
                </strong>
              )}
              <span className="mt-1 block text-sm font-semibold text-slate-500 transition group-hover:text-slate-700">
                {label}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default DashboardStats;
