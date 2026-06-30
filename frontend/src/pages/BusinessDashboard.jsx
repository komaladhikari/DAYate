import {
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  ChevronDown,
  Coffee,
  DollarSign,
  Heart,
  Home,
  Info,
  Megaphone,
  Settings,
  Star,
  Store,
  User,
  UserRound,
  Users,
} from "lucide-react";
import logo from "../assets/image2.png";
import dinnerImage from "../assets/image3.jpg";
import patioImage from "../assets/image6.jpg";
import dessertImage from "../assets/image5.jpg";

const navItems = [
  { label: "Overview", icon: Home, active: true },
  { label: "Reservations", icon: CalendarDays },
  { label: "Activity & Stats", icon: BarChart3 },
  { label: "Customers", icon: Users },
  { label: "Menu & Services", icon: Coffee },
  { label: "Reviews", icon: Star },
  { label: "Promotions", icon: Megaphone },
  { label: "Profile", icon: UserRound },
  { label: "Settings", icon: Settings },
];

const metrics = [
  {
    title: "Total Date Selections",
    value: "128",
    detail: "+18% from last week",
    icon: Heart,
    iconClass: "bg-orange-100 text-orange-500",
    detailClass: "text-emerald-600",
  },
  {
    title: "Upcoming Reservations",
    value: "24",
    detail: "Today: 8",
    icon: CalendarDays,
    iconClass: "bg-orange-100 text-orange-500",
    detailClass: "text-orange-500",
  },
  {
    title: "Total Revenue (Est.)",
    value: "$1,842",
    detail: "+12% from last week",
    icon: DollarSign,
    iconClass: "bg-emerald-100 text-emerald-600",
    detailClass: "text-emerald-600",
  },
  {
    title: "Repeat Customers",
    value: "36",
    detail: "+9% from last week",
    icon: Users,
    iconClass: "bg-violet-100 text-violet-600",
    detailClass: "text-emerald-600",
  },
];

const reservations = [
  { names: "Sarah & James", date: "May 14, 2025", time: "7:00 PM", people: "2 people", status: "Confirmed" },
  { names: "Olivia & Liam", date: "May 14, 2025", time: "8:30 PM", people: "2 people", status: "Confirmed" },
  { names: "Emma & Noah", date: "May 15, 2025", time: "6:30 PM", people: "2 people", status: "Pending" },
  { names: "Ava & William", date: "May 15, 2025", time: "9:00 PM", people: "2 people", status: "Confirmed" },
];

const popularItems = [
  { title: "Romantic Dinner", count: "48 selections", image: dinnerImage },
  { title: "Cozy Outdoor Seating", count: "35 selections", image: patioImage },
  { title: "Dessert & Coffee", count: "28 selections", image: dessertImage },
];

const chartPoints = [
  [0, 120],
  [120, 72],
  [240, 96],
  [360, 48],
  [480, 56],
  [600, 128],
  [720, 152],
];

const linePath = chartPoints.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
const areaPath = `${linePath} L 720 190 L 0 190 Z`;

const BusinessDashboard = () => {
  const name = localStorage.getItem("accountName") || "The Cozy Cafe";

  const avatarText = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <section className="min-h-screen bg-[#fff8f2] text-slate-950">
      <header className="sticky top-0 z-30 border-b border-orange-200 bg-[#ff9847]">
        <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-8">
          <img src={logo} alt="DAYate" className="h-14 w-auto object-contain" />
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Notifications"
              className="hidden h-11 w-11 items-center justify-center rounded-full text-slate-950 transition hover:bg-white/20 sm:flex"
            >
              <Bell size={24} />
            </button>
            <button
              type="button"
              className="flex min-w-0 items-center gap-3 rounded-full px-2 py-1 text-left transition hover:bg-white/20"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-black text-orange-300 shadow-lg shadow-slate-900/15">
                {avatarText || "TC"}
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className="block truncate text-lg font-black">{name}</span>
                <span className="block text-sm font-semibold text-slate-800">Business Account</span>
              </span>
              <ChevronDown size={20} className="hidden sm:block" />
            </button>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-orange-100 bg-white/72 px-4 py-4 shadow-[8px_0_30px_rgba(251,146,60,0.08)] lg:min-h-[calc(100vh-80px)] lg:border-b-0 lg:border-r lg:px-5 lg:py-9">
          <nav className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-3 lg:overflow-visible lg:pb-0">
            {navItems.map(({ label, icon: Icon, active }) => (
              <button
                key={label}
                type="button"
                className={`flex h-12 shrink-0 items-center gap-3 rounded-lg px-4 text-sm font-extrabold transition lg:w-full ${
                  active
                    ? "bg-orange-50 text-orange-500 shadow-sm"
                    : "text-slate-800 hover:bg-orange-50/70 hover:text-orange-500"
                }`}
              >
                <Icon size={22} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <button
            type="button"
            className="mt-8 hidden h-14 w-full items-center justify-between rounded-lg border border-orange-100 bg-white px-5 text-sm font-black text-slate-800 shadow-sm transition hover:border-orange-200 hover:text-orange-500 lg:flex"
          >
            <span className="flex items-center gap-3">
              <Store size={20} />
              View your business
            </span>
            <ArrowRight size={20} />
          </button>
        </aside>

        <main className="px-4 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1500px]">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-normal text-slate-950 sm:text-4xl">
                  Welcome back, {name}! <span aria-hidden="true">👋</span>
                </h1>
                <p className="mt-2 text-lg font-semibold text-slate-500">
                  Here's what's happening with your business today.
                </p>
              </div>
              <button
                type="button"
                className="flex h-14 w-full items-center justify-center gap-3 rounded-lg border border-orange-100 bg-white px-5 text-sm font-black text-slate-800 shadow-sm md:w-auto"
              >
                <CalendarDays size={20} />
                May 14 - May 20, 2025
                <ChevronDown size={18} />
              </button>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map(({ title, value, detail, icon: Icon, iconClass, detailClass }) => (
                <article key={title} className="rounded-lg border border-orange-100 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-black">{title}</h2>
                        <Info size={17} className="text-slate-400" />
                      </div>
                      <p className="mt-4 text-4xl font-black tracking-normal">{value}</p>
                      <p className={`mt-3 text-sm font-black ${detailClass}`}>{detail}</p>
                    </div>
                    <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${iconClass}`}>
                      <Icon size={30} />
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
              <section className="rounded-lg border border-orange-100 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-black">Upcoming Reservations</h2>
                  <button type="button" className="text-sm font-black text-orange-500 hover:text-orange-600">
                    View all
                  </button>
                </div>

                <div className="mt-6 divide-y divide-orange-100">
                  {reservations.map((reservation, index) => (
                    <div key={`${reservation.names}-${reservation.time}`} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-xl font-black">
                          {index % 2 === 0 ? "S" : "O"}
                        </div>
                        <p className="font-black">{reservation.names}</p>
                      </div>
                      <p className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                        <CalendarDays size={16} />
                        {reservation.date}
                        <span>•</span>
                        {reservation.time}
                      </p>
                      <p className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                        <Users size={16} />
                        {reservation.people}
                      </p>
                      <span
                        className={`inline-flex h-8 min-w-24 items-center justify-center rounded-full px-3 text-sm font-black ${
                          reservation.status === "Confirmed"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-orange-50 text-orange-500"
                        }`}
                      >
                        {reservation.status}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="mt-4 flex h-16 w-full items-center justify-center gap-4 rounded-lg bg-orange-50 text-base font-black text-orange-500 transition hover:bg-orange-100"
                >
                  View all reservations
                  <ArrowRight size={20} />
                </button>
              </section>

              <section className="rounded-lg border border-orange-100 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-black">Date Selections This Week</h2>
                  <button type="button" className="text-sm font-black text-orange-500 hover:text-orange-600">
                    View report
                  </button>
                </div>

                <div className="mt-7 overflow-hidden rounded-lg">
                  <svg viewBox="0 0 760 240" className="h-64 w-full" role="img" aria-label="Weekly date selections line chart">
                    <defs>
                      <linearGradient id="businessChartFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#fb923c" stopOpacity="0.24" />
                        <stop offset="100%" stopColor="#fb923c" stopOpacity="0.03" />
                      </linearGradient>
                    </defs>
                    {[0, 48, 96, 144, 192].map((y) => (
                      <line key={y} x1="0" x2="740" y1={y} y2={y} stroke="#e7e5e4" strokeWidth="1" />
                    ))}
                    {[0, 120, 240, 360, 480, 600, 720].map((x) => (
                      <line key={x} x1={x} x2={x} y1="0" y2="192" stroke="#f3eee9" strokeWidth="1" />
                    ))}
                    <path d={areaPath} fill="url(#businessChartFill)" />
                    <path d={linePath} fill="none" stroke="#ff6b1a" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                    {chartPoints.map(([x, y]) => (
                      <circle key={`${x}-${y}`} cx={x} cy={y} r="8" fill="#ff6b1a" stroke="#fff7ed" strokeWidth="4" />
                    ))}
                    {["May 14", "May 15", "May 16", "May 17", "May 18", "May 19", "May 20"].map((label, index) => (
                      <text key={label} x={index * 120} y="222" fill="#64748b" fontSize="14" fontWeight="700" textAnchor={index === 0 ? "start" : "middle"}>
                        {label}
                      </text>
                    ))}
                  </svg>
                </div>

                <div className="grid overflow-hidden rounded-lg bg-orange-50 sm:grid-cols-4">
                  {[
                    ["128", "Total Selections"],
                    ["+18%", "vs last week"],
                    ["62%", "Weekend Bookings"],
                    ["3.2", "Avg. party size"],
                  ].map(([value, label]) => (
                    <div key={label} className="border-orange-100 p-4 sm:border-l first:sm:border-l-0">
                      <p className={`text-3xl font-black ${value.startsWith("+") ? "text-emerald-600" : "text-slate-950"}`}>{value}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
              <section className="rounded-lg border border-orange-100 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="flex items-center gap-2 text-2xl font-black">
                    Popular With Couples <span aria-hidden="true">💕</span>
                    <Info size={18} className="text-slate-400" />
                  </h2>
                  <button type="button" className="text-sm font-black text-orange-500 hover:text-orange-600">
                    View all
                  </button>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {popularItems.map((item) => (
                    <article key={item.title} className="flex items-center gap-4">
                      <img src={item.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
                      <div>
                        <h3 className="font-black">{item.title}</h3>
                        <p className="mt-1 text-sm font-semibold text-slate-500">{item.count}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-orange-100 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:p-6">
                <h2 className="text-2xl font-black">Quick Actions</h2>
                <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {[
                    ["Create Promotion", Megaphone, "bg-orange-50 text-orange-500"],
                    ["Update Menu", Coffee, "bg-amber-50 text-amber-500"],
                    ["View Reviews", Star, "bg-violet-50 text-violet-600"],
                    ["Business Profile", User, "bg-blue-50 text-blue-600"],
                  ].map(([label, Icon, className]) => (
                    <button key={label} type="button" className="flex h-28 flex-col items-center justify-center gap-3 rounded-lg border border-orange-100 bg-white text-sm font-black shadow-sm transition hover:border-orange-200 hover:-translate-y-0.5">
                      <span className={`flex h-12 w-12 items-center justify-center rounded-full ${className}`}>
                        <Icon size={25} />
                      </span>
                      {label}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default BusinessDashboard;
