import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  LogOut,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  RefreshCw,
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
import { getBusinessDashboard } from "../services/businessDashboardService";

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

const popularImages = [dinnerImage, patioImage, dessertImage];

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Date TBD";

const formatTime = (value) =>
  value
    ? new Date(value).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "Time TBD";

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const getInitials = (value = "") =>
  value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const normalizeStatus = (value = "pending") =>
  value.charAt(0).toUpperCase() + value.slice(1).replace("_", " ");

const buildChartPaths = (chart = []) => {
  const safeChart = chart.length > 0 ? chart : Array.from({ length: 7 }, () => ({ count: 0 }));
  const maxCount = Math.max(...safeChart.map((point) => point.count), 1);
  const step = 720 / Math.max(safeChart.length - 1, 1);
  const points = safeChart.map((point, index) => [
    Number((index * step).toFixed(2)),
    Number((180 - (point.count / maxCount) * 140).toFixed(2)),
  ]);
  const linePath = points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ");

  return {
    points,
    linePath,
    areaPath: `${linePath} L 720 190 L 0 190 Z`,
  };
};

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const fallbackName =
    localStorage.getItem("businessName") ||
    localStorage.getItem("accountName") ||
    "Your Business";
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(({ signal, showRefreshing = false } = {}) => {
    if (showRefreshing) {
      setRefreshing(true);
    }

    return getBusinessDashboard({ signal })
      .then((data) => {
        setDashboard(data);
        setError("");

        if (data.business?.name) {
          localStorage.setItem("businessName", data.business.name);
        }
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Could not load business dashboard.");
        }
      })
      .finally(() => {
        if (!signal?.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    getBusinessDashboard({ signal: controller.signal })
      .then((data) => {
        setDashboard(data);
        setError("");

        if (data.business?.name) {
          localStorage.setItem("businessName", data.business.name);
        }
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Could not load business dashboard.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const handleRefresh = () => {
    loadDashboard({ showRefreshing: true });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("accountName");
    localStorage.removeItem("businessName");
    navigate("/", { replace: true });
  };

  const name = dashboard?.business?.name || fallbackName;
  const business = dashboard?.business || {};
  const metricsData = dashboard?.metrics || {};
  const reservations = dashboard?.upcomingReservations || [];
  const chart = useMemo(() => dashboard?.chart || [], [dashboard?.chart]);
  const dateRange = chart.length > 0
    ? `${chart[0].label} - ${chart[chart.length - 1].label}`
    : "This week";
  const popularItems = (dashboard?.popularItems || []).map((item, index) => ({
    ...item,
    image: popularImages[index % popularImages.length],
  }));
  const chartPaths = useMemo(() => buildChartPaths(chart), [chart]);
  const generatedAt = dashboard?.generatedAt
    ? new Date(dashboard.generatedAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  const metrics = [
    {
      title: "Total Date Selections",
      value: loading ? "..." : String(metricsData.totalSelections || 0),
      detail: loading
        ? "Loading selections"
        : `${metricsData.selectionGrowth > 0 ? "+" : ""}${metricsData.selectionGrowth || 0}% from last week`,
      icon: Heart,
      iconClass: "bg-orange-100 text-orange-500",
      detailClass: Number(metricsData.selectionGrowth || 0) >= 0 ? "text-emerald-600" : "text-red-500",
    },
    {
      title: "Upcoming Reservations",
      value: loading ? "..." : String(metricsData.upcomingReservations || 0),
      detail: loading ? "Loading reservations" : `${metricsData.selectionsThisWeek || 0} this week`,
      icon: CalendarDays,
      iconClass: "bg-orange-100 text-orange-500",
      detailClass: "text-orange-500",
    },
    {
      title: "Total Revenue (Est.)",
      value: loading ? "..." : formatCurrency(metricsData.estimatedRevenue || 0),
      detail: "Based on this week's selections",
      icon: DollarSign,
      iconClass: "bg-emerald-100 text-emerald-600",
      detailClass: "text-emerald-600",
    },
    {
      title: "Repeat Customers",
      value: loading ? "..." : String(metricsData.repeatCustomers || 0),
      detail: "Customers with 2+ selections",
      icon: Users,
      iconClass: "bg-violet-100 text-violet-600",
      detailClass: "text-emerald-600",
    },
  ];

  const avatarText = getInitials(name);

  return (
    <section className="min-h-screen bg-[#fff8f2] text-slate-950">
      <header className="sticky top-0 z-30 border-b border-orange-200 bg-[#ff9847]">
        <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-8">
          <img src={logo} alt="DAYate" className="h-14 w-auto object-contain" />
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              aria-label="Refresh dashboard"
              className="hidden h-11 w-11 items-center justify-center rounded-full text-slate-950 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60 sm:flex"
            >
              <RefreshCw size={22} className={refreshing ? "animate-spin" : ""} />
            </button>
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
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-black text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Log out</span>
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

          <div className="mt-5 hidden rounded-lg border border-orange-100 bg-white p-5 shadow-sm lg:block">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-orange-500">
              Live Account
            </p>
            <div className="mt-4 space-y-3 text-sm font-semibold text-slate-600">
              <p className="flex items-start gap-2">
                <Store size={17} className="mt-0.5 shrink-0 text-slate-400" />
                <span>{business.type || "restaurant/cafe"}</span>
              </p>
              <p className="flex items-start gap-2">
                <Mail size={17} className="mt-0.5 shrink-0 text-slate-400" />
                <span className="break-all">{business.email || "No email on file"}</span>
              </p>
              <p className="flex items-start gap-2">
                <Phone size={17} className="mt-0.5 shrink-0 text-slate-400" />
                <span>{business.phone || "No phone added"}</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin size={17} className="mt-0.5 shrink-0 text-slate-400" />
                <span>{business.address || "No address added"}</span>
              </p>
            </div>
          </div>
        </aside>

        <main className="px-4 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1500px]">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-normal text-slate-950 sm:text-4xl">
                  Welcome back, {name}! <span aria-hidden="true">👋</span>
                </h1>
                <p className="mt-2 text-lg font-semibold text-slate-500">
                  Pulled from customer date plans that selected this business.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.08em] text-slate-500">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                    Connected to live plans
                  </span>
                  <span>
                    {generatedAt ? `Last updated ${generatedAt}` : "Loading latest data"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:items-center">
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex h-14 w-full items-center justify-center gap-3 rounded-lg border border-orange-100 bg-white px-5 text-sm font-black text-slate-800 shadow-sm transition hover:border-orange-200 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
                >
                  <RefreshCw size={20} className={refreshing ? "animate-spin" : ""} />
                  {refreshing ? "Refreshing" : "Refresh"}
                </button>
                <button
                  type="button"
                  className="flex h-14 w-full items-center justify-center gap-3 rounded-lg border border-orange-100 bg-white px-5 text-sm font-black text-slate-800 shadow-sm md:w-auto"
                >
                  <CalendarDays size={20} />
                  {dateRange}
                  <ChevronDown size={18} />
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-lg border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

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
                  {loading && (
                    <div className="py-8 text-sm font-bold text-slate-500">
                      Loading reservations for {name}...
                    </div>
                  )}

                  {!loading && reservations.length === 0 && (
                    <div className="py-8 text-sm font-bold text-slate-500">
                      No customer plans have selected this business yet.
                    </div>
                  )}

                  {!loading && reservations.map((reservation) => (
                    <div key={reservation.id} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-xl font-black">
                          {getInitials(reservation.names) || "D"}
                        </div>
                        <div>
                          <p className="font-black">{reservation.names}</p>
                          <p className="text-xs font-semibold text-slate-500">{reservation.planName}</p>
                        </div>
                      </div>
                      <p className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                        <CalendarDays size={16} />
                        {formatDate(reservation.date)}
                        <span>•</span>
                        {formatTime(reservation.time)}
                      </p>
                      <p className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                        <Users size={16} />
                        {reservation.people}
                      </p>
                      <span
                        className={`inline-flex h-8 min-w-24 items-center justify-center rounded-full px-3 text-sm font-black ${
                          reservation.status === "confirmed" || reservation.status === "planned"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-orange-50 text-orange-500"
                        }`}
                      >
                        {normalizeStatus(reservation.status)}
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
                    <path d={chartPaths.areaPath} fill="url(#businessChartFill)" />
                    <path d={chartPaths.linePath} fill="none" stroke="#ff6b1a" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                    {chartPaths.points.map(([x, y]) => (
                      <circle key={`${x}-${y}`} cx={x} cy={y} r="8" fill="#ff6b1a" stroke="#fff7ed" strokeWidth="4" />
                    ))}
                    {(chart.length > 0 ? chart : Array.from({ length: 7 }, (_, index) => ({ label: `Day ${index + 1}` }))).map((point, index, labels) => (
                      <text key={point.label} x={index * (720 / Math.max(labels.length - 1, 1))} y="222" fill="#64748b" fontSize="14" fontWeight="700" textAnchor={index === 0 ? "start" : "middle"}>
                        {point.label}
                      </text>
                    ))}
                    {chart.map((point, index, labels) => (
                      <text key={`${point.label}-count`} x={index * (720 / Math.max(labels.length - 1, 1))} y="24" fill="#94a3b8" fontSize="12" fontWeight="700" textAnchor={index === 0 ? "start" : "middle"}>
                        {point.count}
                      </text>
                    ))}
                  </svg>
                </div>

                <div className="grid overflow-hidden rounded-lg bg-orange-50 sm:grid-cols-4">
                  {[
                    [String(metricsData.totalSelections || 0), "Total Selections"],
                    [`${Number(metricsData.selectionGrowth || 0) > 0 ? "+" : ""}${metricsData.selectionGrowth || 0}%`, "vs last week"],
                    [String(metricsData.selectionsThisWeek || 0), "This Week"],
                    [String(metricsData.averagePartySize || 0), "Avg. party size"],
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
                  {loading && (
                    <div className="text-sm font-bold text-slate-500 md:col-span-3">
                      Loading popular selections...
                    </div>
                  )}

                  {!loading && popularItems.length === 0 && (
                    <div className="text-sm font-bold text-slate-500 md:col-span-3">
                      Popular items will appear after customers choose this business in their plans.
                    </div>
                  )}

                  {!loading && popularItems.map((item) => (
                    <article key={item.title} className="flex items-center gap-4">
                      <img src={item.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
                      <div>
                        <h3 className="font-black">{item.title}</h3>
                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          {item.count} {item.count === 1 ? "selection" : "selections"}
                        </p>
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
