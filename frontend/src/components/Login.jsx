import { useState } from "react";
import "./Login.css";
import {Link, useNavigate} from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:5001'
      const res = await fetch(`${API}/api/user/login`, {
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

      // on success: store token (if provided) and navigate
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      alert('Login successful')
/     // console.log(data)
      navigate('/dashboard')
    } catch (error) {
      console.error(error);   
      alert("Could not connect to backend");
    }
  };

  return (
    <section className="grid gap-10 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div className="space-y-5">
        <span className="inline-flex rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 shadow-sm">
          Welcome back
        </span>
        <h1 className="text-5xl font-black tracking-tight text-slate-950">
          Login to pick up where your last date plan left off.
        </h1>
        <p className="max-w-xl text-lg leading-8 text-slate-600">
          Save ideas, manage plans, and keep every detail in one place so nothing gets lost before the big night.
        </p>
        <div className="flex gap-3">
          <Link to="/" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Back home</Link>
          <Link to="/activities" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">See ideas</Link>
        </div>
      </div>

      <form className="rounded-4xl border border-white bg-white/90 p-8 shadow-2xl shadow-rose-100 backdrop-blur" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-black text-slate-900">Login</h2>
        <p className="mt-2 text-sm text-slate-500">Use the same email and password you registered with.</p>

        <div className="mt-8 space-y-4">
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:bg-white"
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:bg-white"
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="mt-6 w-full rounded-full bg-linear-to-r from-rose-500 to-amber-400 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5">
          Login
        </button>

        <div className="login-cta mt-6">
          <Link to="/register" className="signup-btn">Sign Up</Link>

          <div className="divider-line" />

          <div className="social-row" aria-label="social logins">
            <button aria-label="Continue with Facebook" title="Continue with Facebook" className="social-fb" type="button">
              <svg viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg" role="img"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 4.99 3.66 9.12 8.44 9.88v-6.99H8.08v-2.89h2.22V9.41c0-2.2 1.31-3.41 3.32-3.41.96 0 1.97.17 1.97.17v2.17h-1.11c-1.1 0-1.44.68-1.44 1.39v1.65h2.45l-.39 2.89h-2.06v6.99c4.78-.76 8.44-4.89 8.44-9.88z"/></svg>
            </button>

            <button aria-label="Continue with Google" title="Continue with Google" className="social-gg" type="button">
              <svg viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" role="img" width="48" height="48">
                <path fill="#4285F4" d="M533.5 278.4c0-17.8-1.6-35-4.6-51.6H272v97.8h147.2c-6.4 34.8-25.6 64.3-54.5 84v69h87.9c51.4-47.4 81.9-117.2 81.9-199.2z"/>
                <path fill="#34A853" d="M272 544.3c73.7 0 135.6-24.4 180.8-66.4l-87.9-69c-24.4 16.4-55.6 25.9-92.9 25.9-71.4 0-132-48.1-153.6-112.6H24.4v70.8C69 488.3 163.7 544.3 272 544.3z"/>
                <path fill="#FBBC05" d="M118.4 327.3c-10.9-32.9-10.9-68.1 0-101L24.4 155.5C-6.7 213.2-6.7 331.1 24.4 388.8l94-61.5z"/>
                <path fill="#EA4335" d="M272 107.7c39.9 0 75.9 13.8 104.2 40.9l78.1-78.1C417.6 24.1 345.7 0 272 0 163.7 0 69 56 24.4 155.5l94 61.5c21.6-64.5 82.2-112.6 153.6-112.6z"/>
              </svg>
            </button>

            <button aria-label="Continue with Apple" title="Continue with Apple" className="social-apple" type="button">
              <svg viewBox="0 0 24 24" width="48" height="48" xmlns="http://www.w3.org/2000/svg" role="img"><path fill="#000" d="M16.365 1.43c.44-.53.74-1.22.66-1.93-.63.03-1.39.42-1.84.95-.4.46-.74 1.18-.66 1.88.68.05 1.39-.33 1.84-.9zM12.7 6.94c.37-.44.76-.92 1.26-1.3.3-.22.67-.42 1.03-.52.37-.1.72-.15 1.07-.12.02.43-.03.87-.17 1.3-.16.52-.4 1.05-.76 1.48-.59.66-1.48 1.05-2.32.97-.18-.02-.36-.05-.54-.1.3-.9.3-1.98.23-1.9zM19.5 8.3c-.08-.02-.17-.03-.25-.04-.06 0-.12.03-.16.08-.9 1.04-1.97 1.8-3.23 2.18-1.1.33-2.25.06-3.2-.52-.85-.52-1.46-1.36-1.88-2.24-.4-.85-.56-1.8-.38-2.72.16-.85.63-1.63 1.3-2.24.6-.54 1.37-.86 2.12-.93 1.49-.14 2.98.73 3.7 1.9.38.62.63 1.34.67 2.07.05 1.02-.13 2.06-.79 2.66z"/></svg>
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Login;