import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  Image,
  MessageCircle,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import dinnerImage from "../assets/image3.jpg";
import cafeImage from "../assets/image5.jpg";
import patioImage from "../assets/image6.jpg";
import { getAdminDashboard, updateBusinessApproval } from "../services/adminDashboardService";

const images = [dinnerImage, cafeImage, patioImage];

const formatNumber = (value = 0) => new Intl.NumberFormat("en-US").format(value);

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No date";

const formatTime = (value) =>
  value
    ? new Date(value).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

const getGrowthLabel = (value = 0) => `${value > 0 ? "+" : ""}${value}%`;

const getInitials = (value = "") =>
  value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

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

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reviewingId, setReviewingId] = useState("");
  const [error, setError] = useState("");

  const loadDashboard = ({ signal, showRefreshing = false } = {}) => {
    if (showRefreshing) setRefreshing(true);

    return getAdminDashboard({ signal })
      .then((data) => {
        setDashboard(data);
        setError("");
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Could not load admin dashboard.");
        }
      })
      .finally(() => {
        if (!signal?.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      });
  };

  useEffect(() => {
    const controller = new AbortController();

    getAdminDashboard({ signal: controller.signal })
      .then((data) => {
        setDashboard(data);
        setError("");
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Could not load admin dashboard.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const handleReview = async (businessId, approvalStatus) => {
    setReviewingId(businessId);
    setError("");

    try {
      await updateBusinessApproval({ businessId, approvalStatus });
      await loadDashboard({ showRefreshing: true });
    } catch (requestError) {
      setError(requestError.message || "Could not update business approval.");
    } finally {
      setReviewingId("");
    }
  };

  const metrics = dashboard?.metrics || {};
  const activity = dashboard?.activity || {};
  const chart = useMemo(() => dashboard?.chart || [], [dashboard?.chart]);
  const chartPaths = useMemo(() => buildChartPaths(chart), [chart]);
  const dateRange = dashboard?.range
    ? `${dashboard.range.startLabel} - ${dashboard.range.endLabel}`
    : "This week";
  const generatedAt = dashboard?.generatedAt ? formatTime(dashboard.generatedAt) : "";

  const statCards = [
    {
      label: "Total Users",
      value: metrics.totalUsers,
      detail: getGrowthLabel(metrics.usersGrowth || 0),
      icon: Users,
      iconClass: "bg-rose-100 text-rose-500",
    },
    {
      label: "Total Businesses",
      value: metrics.totalBusinesses,
      detail: getGrowthLabel(metrics.businessesGrowth || 0),
      icon: Store,
      iconClass: "bg-orange-100 text-orange-500",
    },
    {
      label: "Date Plans Created",
      value: metrics.totalPlans,
      detail: getGrowthLabel(metrics.plansGrowth || 0),
      icon: CalendarDays,
      iconClass: "bg-violet-100 text-violet-600",
    },
    {
      label: "Pending Business Approvals",
      value: metrics.pendingBusinesses,
      detail: "Review pending",
      icon: Clock3,
      iconClass: "bg-amber-100 text-amber-500",
    },
    {
      label: "Reports / Issues",
      value: metrics.reports,
      detail: "View all",
      icon: ShieldAlert,
      iconClass: "bg-rose-100 text-rose-500",
    },
  ];

  return (
    <section className="min-h-[calc(100vh-96px)] bg-[#fff8f2] px-4 py-8 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-[1700px]">
        <header className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-normal">
              Welcome back, Admin! <span aria-hidden="true">👋</span>
            </h1>
            <p className="mt-3 text-lg font-semibold text-slate-500">
              Live platform activity from DAYate users, businesses, plans, and messages.
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.08em] text-slate-500">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                Connected to database
              </span>
              <span>{generatedAt ? `Last updated ${generatedAt}` : "Loading latest data"}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => loadDashboard({ showRefreshing: true })}
              disabled={refreshing}
              className="flex h-14 items-center justify-center gap-3 rounded-lg border border-orange-100 bg-white px-5 text-sm font-black text-slate-800 shadow-sm transition hover:border-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw size={20} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing" : "Refresh"}
            </button>
            <button
              type="button"
              className="flex h-14 items-center justify-center gap-3 rounded-lg border border-orange-100 bg-white px-5 text-sm font-black text-slate-800 shadow-sm"
            >
              <CalendarDays size={20} />
              {dateRange}
              <ChevronDown size={18} />
            </button>
          </div>
        </header>

        {error && (
          <div className="mt-6 rounded-lg border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {statCards.map(({ label, value, detail, icon: Icon, iconClass }) => (
            <article key={label} className="rounded-lg border border-orange-100 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-5">
                <span className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
                  <Icon size={38} />
                </span>
                <div>
                  <h2 className="text-base font-black">{label}</h2>
                  <p className="mt-3 text-3xl font-black">{loading ? "..." : formatNumber(value || 0)}</p>
                  <p className="mt-2 text-sm font-black text-emerald-600">{loading ? "Loading" : detail}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-lg border border-orange-100 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black">Pending Business Approvals</h2>
              <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-orange-500">
                {formatNumber(metrics.pendingBusinesses || 0)} pending
              </span>
            </div>

            <div className="mt-6 divide-y divide-orange-100">
              {loading && <p className="py-8 text-sm font-bold text-slate-500">Loading approvals...</p>}
              {!loading && dashboard?.pendingBusinesses?.length === 0 && (
                <p className="py-8 text-sm font-bold text-slate-500">No businesses are waiting for review.</p>
              )}
              {!loading && dashboard?.pendingBusinesses?.map((business, index) => (
                <div key={business.id} className="grid gap-4 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                  <div className="flex items-center gap-4">
                    <img src={images[index % images.length]} alt="" className="h-16 w-16 rounded-lg object-cover" />
                    <div>
                      <h3 className="font-black">{business.name}</h3>
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        {business.type} {business.address ? `• ${business.address}` : ""}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-600">
                    Submitted<br />
                    <span className="font-black text-slate-900">{formatDate(business.submittedAt)}</span>
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleReview(business.id, "approved")}
                      disabled={reviewingId === business.id}
                      className="h-11 rounded-lg border border-emerald-200 bg-emerald-50 px-4 text-sm font-black text-emerald-700 disabled:opacity-60"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReview(business.id, "rejected")}
                      disabled={reviewingId === business.id}
                      className="h-11 rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-black text-red-600 disabled:opacity-60"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-orange-100 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black">Platform Activity (This Week)</h2>
              <span className="text-sm font-black text-orange-500">Live report</span>
            </div>
            <div className="mt-7 overflow-hidden rounded-lg">
              <svg viewBox="0 0 760 240" className="h-64 w-full" role="img" aria-label="Weekly platform activity chart">
                <defs>
                  <linearGradient id="adminChartFill" x1="0" x2="0" y1="0" y2="1">
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
                <path d={chartPaths.areaPath} fill="url(#adminChartFill)" />
                <path d={chartPaths.linePath} fill="none" stroke="#ff6b1a" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                {chartPaths.points.map(([x, y]) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r="8" fill="#ff6b1a" stroke="#fff7ed" strokeWidth="4" />
                ))}
                {(chart.length > 0 ? chart : Array.from({ length: 7 }, (_, index) => ({ label: `Day ${index + 1}` }))).map((point, index, labels) => (
                  <text key={point.label} x={index * (720 / Math.max(labels.length - 1, 1))} y="222" fill="#64748b" fontSize="14" fontWeight="700" textAnchor={index === 0 ? "start" : "middle"}>
                    {point.label}
                  </text>
                ))}
              </svg>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-4">
              {[
                ["Plans Created", activity.plansCreated, CalendarDays, "text-orange-500"],
                ["Messages Sent", activity.messagesSent, MessageCircle, "text-blue-500"],
                ["Active Users", activity.activeUsers, Users, "text-amber-500"],
                ["Photos Shared", activity.photosShared, Image, "text-emerald-600"],
              ].map(([label, value, Icon, colorClass]) => (
                <div key={label} className="rounded-lg bg-orange-50 p-4">
                  <Icon className={colorClass} size={26} />
                  <p className="mt-3 text-2xl font-black">{formatNumber(value || 0)}</p>
                  <p className="text-xs font-black text-slate-600">{label}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <section className="rounded-lg border border-orange-100 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">Recent Users</h2>
              <span className="text-sm font-black text-orange-500">View all</span>
            </div>
            <div className="mt-5 divide-y divide-orange-100">
              {dashboard?.recentUsers?.map((user) => (
                <div key={user.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-black text-orange-300">
                      {getInitials(user.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-black">{user.name}</p>
                      <p className="truncate text-sm font-semibold text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <p className="text-right text-sm font-semibold text-slate-600">
                    Joined<br />
                    <span className="font-black text-slate-900">{formatDate(user.joinedAt)}</span>
                  </p>
                </div>
              ))}
              {!loading && dashboard?.recentUsers?.length === 0 && (
                <p className="py-8 text-sm font-bold text-slate-500">No users yet.</p>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-orange-100 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">Top Businesses</h2>
              <span className="text-sm font-black text-orange-500">View all</span>
            </div>
            <div className="mt-5 divide-y divide-orange-100">
              {dashboard?.topBusinesses?.map((business, index) => (
                <div key={business.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-sm font-black text-orange-500">
                      {index + 1}
                    </span>
                    <img src={images[index % images.length]} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-black">{business.name}</p>
                      <p className="text-sm font-semibold text-slate-500">
                        {formatNumber(business.selections)} selections
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-emerald-600">
                    {business.approvalStatus}
                  </span>
                </div>
              ))}
              {!loading && dashboard?.topBusinesses?.length === 0 && (
                <p className="py-8 text-sm font-bold text-slate-500">No businesses yet.</p>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-orange-100 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">Reports & Safety</h2>
              <span className="text-sm font-black text-orange-500">View all</span>
            </div>
            <div className="mt-5 divide-y divide-orange-100">
              {dashboard?.reports?.map((report) => (
                <div key={report.type} className="flex items-center justify-between gap-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
                      <AlertTriangle size={21} />
                    </span>
                    <div>
                      <p className="font-black">{report.label}</p>
                      <p className="text-sm font-semibold text-slate-500">{report.detail}</p>
                    </div>
                  </div>
                  <span className="text-lg font-black text-slate-900">{formatNumber(report.count)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-6 flex flex-col gap-4 rounded-lg bg-orange-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-orange-500">
              <ShieldCheck size={34} />
            </span>
            <div>
              <h2 className="text-2xl font-black">Keep DAYate Safe</h2>
              <p className="mt-1 font-semibold text-slate-600">
                Review pending approvals regularly to keep the community trustworthy.
              </p>
            </div>
          </div>
          <button type="button" className="flex h-14 items-center justify-center gap-3 rounded-lg bg-slate-950 px-6 text-sm font-black text-white">
            Review Now
            <ArrowRight size={18} />
          </button>
        </section>
      </div>
    </section>
  );
};

export default AdminDashboard;
