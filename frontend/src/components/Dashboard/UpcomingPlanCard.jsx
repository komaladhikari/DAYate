import { CalendarDays, Clock3, MapPin, UserRound } from "lucide-react";

const statusStyles = {
  confirmed: "bg-emerald-100 text-emerald-700",
  planned: "bg-emerald-100 text-emerald-700",
  in_progress: "bg-blue-100 text-blue-700",
  pending: "bg-amber-100 text-amber-700",
  draft: "bg-slate-100 text-slate-600",
  failed: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-violet-100 text-violet-700",
};

const formatLabel = (value) =>
  value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const getId = (value) => String(value?._id || value || "");

const UpcomingPlanCard = ({ plan, user }) => {
  const activity = plan.activities?.[0];
  const status = activity?.bookingStatus || plan.status || "draft";
  const partnerName =
    getId(plan.createdBy) === getId(user)
      ? plan.partner?.name
      : plan.createdBy?.name;

  const date = new Date(plan.date);
  const activityTime = activity?.time ? new Date(activity.time) : null;
  const location =
    activity?.location ||
    [activity?.from, activity?.to].filter(Boolean).join(" to ");

  return (
    <article className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="truncate text-xl font-black text-slate-950">
            {plan.name}
          </h3>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={16} />
              {date.toLocaleDateString([], {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>

            {activityTime && (
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={16} />
                {activityTime.toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            )}

            {location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={16} />
                {location}
              </span>
            )}
          </div>

          {partnerName && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700">
              <UserRound size={16} />
              With {partnerName}
            </p>
          )}
        </div>

        <span
          className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
            statusStyles[status] || statusStyles.draft
          }`}
        >
          {formatLabel(status)}
        </span>
      </div>
    </article>
  );
};

export default UpcomingPlanCard;
