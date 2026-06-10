import { CalendarPlus } from "lucide-react";
import { Link } from "react-router-dom";
import UpcomingPlanCard from "./UpcomingPlanCard";

const UpcomingPlansSkeleton = () => (
  <div className="mt-6 space-y-4" aria-label="Loading upcoming plans">
    {[1, 2, 3].map((item) => (
      <div
        key={item}
        className="h-32 animate-pulse rounded-2xl border border-orange-100 bg-white/70"
      />
    ))}
  </div>
);

const UpcomingPlans = ({ plans, user, loading, unavailable, onRetry }) => {
  return (
    <section
      className="min-h-96 rounded-3xl border border-orange-100 bg-orange-50/50 p-6 shadow-lg shadow-orange-100/50"
      aria-busy={loading}
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-950">Upcoming Plans</h2>
        <Link
          to="/my-plans"
          className="text-sm font-bold text-orange-500 transition hover:text-orange-600"
        >
          View all
        </Link>
      </div>

      {loading ? (
        <UpcomingPlansSkeleton />
      ) : unavailable ? (
        <div className="mt-6 flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/60 p-8 text-center">
          <div>
            <p className="font-bold text-red-800">Plans could not be loaded</p>
            <p className="mt-2 text-sm leading-6 text-red-600">
              Check your connection and try again.
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-5 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : plans.length > 0 ? (
        <div className="mt-6 space-y-4">
          {plans.slice(0, 3).map((plan) => (
            <UpcomingPlanCard key={plan._id} plan={plan} user={user} />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-orange-200 bg-white/70 p-8 text-center">
          <div>
            <CalendarPlus
              size={32}
              className="mx-auto text-orange-500"
              aria-hidden="true"
            />
            <p className="mt-4 font-bold text-slate-800">
              No upcoming plans yet
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create a plan and it will appear here.
            </p>
            <Link
              to="/activities"
              className="mt-5 inline-flex rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Create a Plan
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default UpcomingPlans;
