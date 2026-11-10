import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Building2, MapPin, Phone, Store, User, Mail, Lock, ShieldCheck, RefreshCw } from "lucide-react";

const storeSession = ({ token, user }) => {
  if (token) {
    localStorage.setItem("token", token);
  }

  if (user?.role) {
    localStorage.setItem("role", user.role);
  }

  if (user?.name) {
    localStorage.setItem("accountName", user.name);
  }

  if (user?.businessName) {
    localStorage.setItem("businessName", user.businessName);
  } else {
    localStorage.removeItem("businessName");
  }
};

const Register = ({ accountType = "user" }) => {
  const isBusiness = accountType === "business";
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    businessType: "restaurant",
    phone: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!verificationEmail || secondsRemaining <= 0) return undefined;

    const timer = window.setInterval(() => {
      setSecondsRemaining((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [verificationEmail, secondsRemaining]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const API = import.meta.env.VITE_API_URL || "https://dayate-zw7n.onrender.com";
      const endpoint = isBusiness
        ? "/api/user/business/register"
        : "/api/user/register";
      const body = isBusiness
        ? {
            ownerName: form.name,
            businessName: form.businessName,
            businessType: form.businessType,
            phone: form.phone,
            address: form.address,
            email: form.email,
            password: form.password,
          }
        : {
            name: form.name,
            email: form.email,
            password: form.password,
          };

      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Registration failed");
        return;
      }

      if (!isBusiness && data.requiresVerification) {
        setVerificationEmail(data.email);
        setVerificationCode("");
        setSecondsRemaining(data.expiresInSeconds || 300);
        return;
      }

      storeSession(data);

      navigate(location.state?.from || (isBusiness ? "/business/dashboard" : "/dashboard"), {
        replace: true,
      });
    } catch (error) {
      console.error(error);
      alert("Could not connect to backend");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const API = import.meta.env.VITE_API_URL || "https://dayate-zw7n.onrender.com";
      const res = await fetch(`${API}/api/user/register/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: verificationEmail,
          code: verificationCode,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Verification failed");
        if (["CODE_EXPIRED", "CODE_INVALID", "TOO_MANY_ATTEMPTS"].includes(data.code)) {
          setSecondsRemaining(0);
        }
        return;
      }

      storeSession(data);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (error) {
      console.error(error);
      alert("Could not connect to backend");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setIsSubmitting(true);

    try {
      const API = import.meta.env.VITE_API_URL || "https://dayate-zw7n.onrender.com";
      const res = await fetch(`${API}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          email: verificationEmail,
          password: form.password,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Could not send another code");
        return;
      }

      setVerificationCode("");
      setSecondsRemaining(data.expiresInSeconds || 300);
      alert("A new code was sent. Your previous code is no longer valid.");
    } catch (error) {
      console.error(error);
      alert("Could not connect to backend");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedTime = `${Math.floor(secondsRemaining / 60)}:${String(
    secondsRemaining % 60
  ).padStart(2, "0")}`;

  return (
    <section className="min-h-[calc(100vh-90px)] bg-[#ffbf8b] px-4 py-14">
      <div className="mx-auto flex max-w-6xl items-center justify-center">
        <form
          onSubmit={verificationEmail ? handleVerify : handleSubmit}
          className="w-full max-w-[520px] rounded-[34px] border border-white/70 bg-white/90 px-10 py-12 shadow-[0_25px_70px_rgba(15,23,42,0.14)] backdrop-blur"
        >
          <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-orange-200 bg-orange-50 text-orange-500">
            {verificationEmail ? (
              <ShieldCheck size={34} strokeWidth={2} />
            ) : isBusiness ? (
              <Building2 size={34} strokeWidth={2} />
            ) : (
              <User size={34} strokeWidth={2} />
            )}
          </div>

          <h1 className="text-center text-4xl font-black tracking-tight text-slate-950">
            {verificationEmail ? "Verify Your Email" : isBusiness ? "Business Sign Up" : "Sign Up"}
          </h1>

          <p className="mt-4 text-center text-lg font-medium text-slate-500">
            {verificationEmail
              ? `We sent a 6-character code to ${verificationEmail}`
              : isBusiness
              ? "Register your restaurant or cafe below."
              : "Create your free account below."}
          </p>

          {verificationEmail ? (
            <div className="mt-10">
              <div className="flex items-center gap-4 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 shadow-sm focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
                <ShieldCheck className="text-orange-500" size={22} />
                <input
                  type="text"
                  name="verificationCode"
                  aria-label="Verification code"
                  placeholder="Enter 6-character code"
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(
                      e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 6)
                    )
                  }
                  minLength={6}
                  maxLength={6}
                  autoComplete="one-time-code"
                  autoFocus
                  required
                  className="w-full bg-transparent text-center text-xl font-extrabold tracking-[0.35em] text-slate-800 outline-none placeholder:text-base placeholder:font-medium placeholder:tracking-normal placeholder:text-slate-400"
                />
              </div>

              <p className={`mt-4 text-center text-sm font-semibold ${secondsRemaining > 0 ? "text-slate-500" : "text-red-500"}`}>
                {secondsRemaining > 0
                  ? `Code expires in ${formattedTime}`
                  : "This code is expired or no longer valid."}
              </p>
            </div>
          ) : (
          <div className="mt-10 space-y-6">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <User className="text-slate-400" size={22} />
              <input
                type="text"
                name="name"
                placeholder="Enter name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-transparent text-lg font-medium text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            {isBusiness && (
              <>
                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                  <Store className="text-slate-400" size={22} />
                  <input
                    type="text"
                    name="businessName"
                    placeholder="Business name"
                    value={form.businessName}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent text-lg font-medium text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                  <Building2 className="text-slate-400" size={22} />
                  <select
                    name="businessType"
                    value={form.businessType}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent text-lg font-medium text-slate-700 outline-none"
                  >
                    <option value="restaurant">Restaurant</option>
                    <option value="cafe">Cafe</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                  <Phone className="text-slate-400" size={22} />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Business phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full bg-transparent text-lg font-medium text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                  <MapPin className="text-slate-400" size={22} />
                  <input
                    type="text"
                    name="address"
                    placeholder="Business address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full bg-transparent text-lg font-medium text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>
              </>
            )}

            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <Mail className="text-slate-400" size={22} />
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent text-lg font-medium text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <Lock className="text-slate-400" size={22} />
              <input
                type="password"
                name="password"
                placeholder="Create password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-transparent text-lg font-medium text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <Lock className="text-slate-400" size={22} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-transparent text-lg font-medium text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || (verificationEmail && (verificationCode.length !== 6 || secondsRemaining === 0))}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-orange-400 to-orange-600 px-6 py-4 text-lg font-extrabold text-white shadow-xl shadow-orange-200 transition hover:-translate-y-0.5 hover:shadow-orange-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isSubmitting
              ? "Please wait..."
              : verificationEmail
              ? "Validate Code"
              : isBusiness
              ? "Create Business Account"
              : "Create Account"}
          </button>

          {verificationEmail && (
            <button
              type="button"
              onClick={handleResend}
              disabled={isSubmitting}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-orange-300 bg-orange-50 px-6 py-3 text-base font-bold text-orange-600 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw size={18} />
              Send another code
            </button>
          )}

          {!verificationEmail && <p className="mt-8 text-center text-sm font-medium leading-6 text-slate-500">
            By creating an account, you agree to our <br />
            <span className="text-orange-500">Terms of Service</span> and{" "}
            <span className="text-orange-500">Privacy Policy.</span>
          </p>}

          {!verificationEmail && <div className="mt-7 text-center">
            <Link
              to={isBusiness ? "/business/login" : "/login"}
              className="text-sm font-semibold text-slate-500 underline underline-offset-4 hover:text-orange-500"
            >
              Already have an account? Sign in
            </Link>
          </div>}
        </form>
      </div>
    </section>
  );
};

export default Register;
