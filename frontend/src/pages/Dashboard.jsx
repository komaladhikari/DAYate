import DashboardStats from "../components/Dashboard/DashboardStats";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import QuickActions from "../components/Dashboard/QuickActions";
import UpcomingPlans from "../components/Dashboard/UpcomingPlans";
import useDashboard from "../hooks/useDashboard";

const Dashboard = () => {
  const { user, upcomingPlans, stats, loading, error, hasData, refetch } =
    useDashboard();
  const initialLoading = loading && !hasData;
  const unavailable = Boolean(error) && !hasData;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <DashboardHeader user={user} loading={initialLoading} />

      {error && (
        <div
          role="alert"
          className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={loading}
            className="font-bold underline underline-offset-4 disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? "Trying again..." : "Try again"}
          </button>
        </div>
      )}

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <UpcomingPlans
            plans={upcomingPlans}
            user={user}
            loading={initialLoading}
            unavailable={unavailable}
            onRetry={refetch}
          />

          <DashboardStats
            stats={stats}
            loading={initialLoading}
            unavailable={unavailable}
          />
        </div>

        <QuickActions />
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {loading ? "Loading dashboard data" : "Dashboard data loaded"}
      </p>
    </main>
  );
};

export default Dashboard;
