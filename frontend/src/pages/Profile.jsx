import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Bell,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock3,
  Edit3,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const InfoRow = ({ label, value }) => (
  <div className="grid gap-1 border-b border-slate-100 py-3 last:border-b-0 sm:grid-cols-[190px_1fr] sm:gap-6">
    <dt className="text-sm font-semibold text-slate-700">{label}</dt>
    <dd className="min-w-0 text-sm font-bold text-slate-900">{value || "Not added yet"}</dd>
  </div>
);

const PreferenceRow = ({ title, description, enabled }) => (
  <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-4 last:border-b-0">
    <div>
      <p className="text-sm font-bold text-slate-900">{title}</p>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
    <span
      className={`flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition ${
        enabled ? "justify-end bg-[#ff8b3d]" : "justify-start bg-slate-300"
      }`}
    >
      <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
    </span>
  </div>
);

const Profile = () => {
  const backendUrl =
    import.meta.env.VITE_API_URL || "https://dayate-zw7n.onrender.com";
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!isMounted) return;

        if (response.data.success) {
          setUser(response.data.user);
          setError("");
        } else {
          setError(response.data.message || "Could not load your profile.");
        }
      } catch (profileError) {
        if (isMounted) {
          console.log(profileError);
          setError("Please login first.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [backendUrl, navigate]);

  const displayName = useMemo(() => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split("@")[0];
    return "DAYate User";
  }, [user]);

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-8 w-56 animate-pulse rounded-full bg-orange-100" />
        <div className="mt-10 h-56 animate-pulse rounded-2xl bg-white shadow-sm" />
      </section>
    );
  }

  if (error || !user) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error || "Profile unavailable."}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-normal text-slate-950">
          My Profile
        </h1>
        <p className="mt-3 text-base font-medium text-slate-500">
          Manage your personal information and preferences.
        </p>
      </div>

      <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-lg shadow-orange-100/40 sm:p-8">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-orange-200 via-orange-100 to-amber-50 text-white">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={displayName}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <UserRound size={70} strokeWidth={1.7} />
              )}
              <button
                type="button"
                aria-label="Change profile picture"
                className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white shadow-md transition hover:bg-slate-800"
              >
                <Camera size={17} />
              </button>
            </div>

            <div>
              <h2 className="text-3xl font-black text-slate-950">{displayName}</h2>
              <p className="mt-2 text-base font-bold text-slate-800">{user.email}</p>
              <div className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-500">
                <CalendarDays size={17} />
                <span>Member since 2026</span>
              </div>
              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                <CheckCircle2 size={17} />
                Verified
              </span>
            </div>
          </div>

          <div className="hidden h-20 w-px bg-slate-100 lg:block" />

          <button
            type="button"
            className="inline-flex items-center justify-center gap-3 rounded-xl border border-[#ff8b3d] px-7 py-4 text-sm font-black text-[#f97316] transition hover:bg-orange-50"
          >
            <Edit3 size={18} />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="mt-7 grid gap-7 lg:grid-cols-2">
        <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-lg shadow-orange-100/35">
          <div className="mb-5 flex items-center gap-3">
            <UserRound className="text-[#ff8b3d]" size={26} />
            <h3 className="text-xl font-black text-slate-950">
              Personal Information
            </h3>
          </div>

          <dl>
            <InfoRow label="Full Name" value={user.name || displayName} />
            <InfoRow label="Email Address" value={user.email} />
            <InfoRow label="Phone Number" value={user.phone} />
            <InfoRow label="Bio" value={user.bio} />
            <InfoRow label="Time Zone" value={user.timezone} />
            <InfoRow label="Location" value={user.address || "Not added yet"} />
          </dl>

          <button
            type="button"
            className="mx-auto mt-5 flex w-full max-w-56 items-center justify-center rounded-xl border border-[#ff8b3d] px-5 py-3 text-sm font-black text-[#f97316] transition hover:bg-orange-50"
          >
            Edit Information
          </button>
        </div>

        <div className="space-y-7">
          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-lg shadow-orange-100/35">
            <div className="mb-5 flex items-center gap-3">
              <LockKeyhole className="text-[#ff8b3d]" size={26} />
              <h3 className="text-xl font-black text-slate-950">
                Account & Security
              </h3>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="grid grid-cols-[150px_1fr_auto] items-center gap-4 py-4 text-sm">
                <span className="font-bold text-slate-800">Password</span>
                <span className="font-black tracking-[0.18em] text-slate-950">
                  ********
                </span>
                <button className="font-black text-[#ff6b1a]" type="button">
                  Change
                </button>
              </div>
              <div className="grid grid-cols-[150px_1fr_auto] items-center gap-4 py-4 text-sm">
                <span className="font-bold text-slate-800">Two-Factor Auth</span>
                <span className="font-black text-emerald-700">Enabled</span>
                <button className="font-black text-[#ff6b1a]" type="button">
                  Manage
                </button>
              </div>
              <div className="grid grid-cols-[150px_1fr_auto] items-center gap-4 py-4 text-sm">
                <span className="font-bold text-slate-800">Login Activity</span>
                <span className="text-slate-500">Last login: Today</span>
                <button className="font-black text-[#ff6b1a]" type="button">
                  View
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-lg shadow-orange-100/35">
            <div className="mb-5 flex items-center gap-3">
              <Bell className="text-[#ff8b3d]" size={26} />
              <h3 className="text-xl font-black text-slate-950">Preferences</h3>
            </div>

            <PreferenceRow
              title="Email Notifications"
              description="Receive updates via email"
              enabled
            />
            <PreferenceRow
              title="Push Notifications"
              description="Receive push notifications"
              enabled
            />
            <PreferenceRow
              title="Marketing Emails"
              description="Receive offers and updates"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-lg shadow-orange-100/35">
          <div className="mb-6 flex items-center gap-3">
            <Sparkles className="text-[#ff8b3d]" size={26} />
            <h3 className="text-xl font-black text-slate-950">
              Account Summary
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <CalendarDays className="mx-auto text-[#ff6b1a]" size={36} />
              <p className="mt-3 text-3xl font-black text-slate-950">12</p>
              <p className="text-sm font-medium text-slate-500">Plans Created</p>
            </div>
            <div>
              <Star className="mx-auto text-amber-400" size={36} />
              <p className="mt-3 text-3xl font-black text-slate-950">28</p>
              <p className="text-sm font-medium text-slate-500">Favorites</p>
            </div>
            <div>
              <Clock3 className="mx-auto text-violet-500" size={36} />
              <p className="mt-3 text-3xl font-black text-slate-950">156</p>
              <p className="text-sm font-medium text-slate-500">Hours Saved</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-lg shadow-orange-100/35">
          <div className="mb-6 flex items-center gap-3">
            <Mail className="text-[#ff8b3d]" size={26} />
            <h3 className="text-xl font-black text-slate-950">Contact Details</h3>
          </div>

          <div className="space-y-4 text-sm font-bold text-slate-700">
            <p className="flex items-center gap-3">
              <Mail size={18} className="text-slate-400" />
              {user.email}
            </p>
            <p className="flex items-center gap-3">
              <Phone size={18} className="text-slate-400" />
              {user.phone || "Phone number not added"}
            </p>
            <p className="flex items-center gap-3">
              <MapPin size={18} className="text-slate-400" />
              {user.address || "Location not added"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-5 rounded-2xl border border-orange-200 bg-orange-50/80 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-[#ff6b1a]">
            <ShieldCheck size={30} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-950">
              Your privacy matters
            </h3>
            <p className="text-sm font-medium text-slate-500">
              We are committed to protecting your data and your privacy.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="rounded-xl border border-[#ff8b3d] px-7 py-3 text-sm font-black text-[#f97316] transition hover:bg-white"
        >
          Privacy Policy
        </button>
      </div>
    </section>
  );
};

export default Profile;
