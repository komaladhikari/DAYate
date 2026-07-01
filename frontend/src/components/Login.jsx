import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, Mail, Lock, ShieldCheck } from "lucide-react";

const loginConfig = {
  user: {
    title: "Login",
    subtitle: "Welcome back. Sign in to continue planning.",
    endpoint: "/api/user/login",
    icon: Lock,
    registerPath: "/register",
    registerText: "Don't have an account? Sign up",
    fallbackPath: "/dashboard",
  },
  business: {
    title: "Business Login",
    subtitle: "Manage your restaurant or cafe presence on DAYate.",
    endpoint: "/api/user/business/login",
    icon: BriefcaseBusiness,
    registerPath: "/business/register",
    registerText: "Register your restaurant or cafe",
    fallbackPath: "/business/dashboard",
  },
  admin: {
    title: "Admin Login",
    subtitle: "Sign in with the single DAYate admin account.",
    endpoint: "/api/user/admin",
    icon: ShieldCheck,
    fallbackPath: "/admin/dashboard",
  },
};

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

const Login = ({ accountType = "user" }) => {
  const config = loginConfig[accountType] || loginConfig.user;
  const Icon = config.icon;
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const API = import.meta.env.VITE_API_URL || 'https://dayate-zw7n.onrender.com'
      const res = await fetch(`${API}${config.endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      // backend returns { success: true/false, token?, message? }
      if (!data.success) {
        alert(data.message || "Login failed");
        return;
      }

      storeSession(data);
      alert('Login successful')
      navigate(location.state?.from || config.fallbackPath, { replace: true })
    } catch (error) {
      console.error(error);   
      alert("Could not connect to backend");
    }
  };

  return (
    <section className="min-h-[calc(100vh-90px)] bg-[#ffbf8b] px-4 py-14">
      <div className="mx-auto flex max-w-6xl items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[520px] rounded-[34px] border border-white/70 bg-white/90 px-10 py-12 shadow-[0_25px_70px_rgba(15,23,42,0.14)] backdrop-blur"
        >
          <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-orange-200 bg-orange-50 text-orange-500">
            <Icon size={34} strokeWidth={2} />
          </div>

          <h1 className="text-center text-4xl font-black tracking-tight text-slate-950">
            {config.title}
          </h1>

          <p className="mt-4 text-center text-lg font-medium text-slate-500">
            {config.subtitle}
          </p>

          <div className="mt-10 space-y-6">
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
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-transparent text-lg font-medium text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-orange-400 to-orange-600 px-6 py-4 text-lg font-extrabold text-white shadow-xl shadow-orange-200 transition hover:-translate-y-0.5 hover:shadow-orange-300"
          >
            Login
          </button>

          {config.registerPath && (
            <div className="mt-7 text-center">
              <Link
                to={config.registerPath}
                state={{ from: location.state?.from }}
                className="text-sm font-semibold text-slate-500 underline underline-offset-4 hover:text-orange-500"
              >
                {config.registerText}
              </Link>
            </div>
          )}

          {accountType === "user" && (
            <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm font-semibold text-slate-500">
              <Link to="/business/login" className="hover:text-orange-500">
                Business login
              </Link>
              <Link to="/admin/login" className="hover:text-orange-500">
                Admin login
              </Link>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default Login;
