import DashboardHeader from "../components/Dashboard/DashboardHeader";
import QuickActions from "../components/Dashboard/QuickActions";

const Dashboard = () => {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <DashboardHeader />

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="min-h-96 rounded-3xl border border-orange-100 bg-orange-50/50 p-6 shadow-lg shadow-orange-100/50">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-950">
              Upcoming Plans
            </h2>
            <span className="text-sm font-bold text-orange-500">Coming next</span>
          </div>

          <div className="mt-6 flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-orange-200 bg-white/70 p-8 text-center">
            <div>
              <p className="font-bold text-slate-800">
                Your upcoming plans will appear here.
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                We will connect this section to your plan data in the next
                dashboard step.
              </p>
            </div>
          </div>
        </section>

        <QuickActions />
      </div>
    </main>
  );
};

export default Dashboard;
