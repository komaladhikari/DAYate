import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const DashboardHeader = ({ user, loading }) => {
  const name = user?.name?.trim();

  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          {loading ? "Welcome back!" : `${getGreeting()}${name ? `, ${name}` : ""}!`}
        </h1>
        <p className="mt-2 text-base text-slate-500 sm:text-lg">
          Ready to plan something amazing?
        </p>
      </div>

      <Link
        to="/activities"
        className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
      >
        <Plus size={19} />
        Create New Plan
      </Link>
    </header>
  );
};

export default DashboardHeader;
