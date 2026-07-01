/*import logo from '../assets/image2.png'
import {NavLink} from 'react-router-dom'

const Navbar = () => {
  const linkClass = ({isActive}) =>
    `text-sm font-medium transition ${isActive ? 'text-slate-950' : 'text-slate-950/80 hover:text-slate-950'}`

  return (
    <header className="sticky top-0 z-50 bg-[#ff9847]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3">
          <img src={logo} className="block h-18 w-auto object-contain" alt="" />
        </NavLink>

        <div className="flex items-center gap-5 sm:gap-6">
          <NavLink to="/login" className={linkClass}>
            Sign in
          </NavLink>
          <NavLink
            to="/register"
            className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Get started
          </NavLink>
          <NavLink to="/profile" className={linkClass}>
            Profile
          </NavLink>
        </div>
      </div>
    </header>

  )
}

export default Navbar
*/
import logo from "../assets/image2.png";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const role = localStorage.getItem("role") || "user";
  const isBusinessWorkspace = location.pathname.startsWith("/business/dashboard");
  const dashboardPath =
    role === "admin"
      ? "/admin/dashboard"
      : role === "business"
        ? "/business/dashboard"
        : "/dashboard";

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive
        ? "text-slate-950"
        : "text-slate-950/80 hover:text-slate-950"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("accountName");
    localStorage.removeItem("businessName");
    navigate("/", { replace: true });
  };

  if (isBusinessWorkspace) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-[#ff9847]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <NavLink to={isLoggedIn ? dashboardPath : "/"} className="flex items-center gap-3">
          <img
            src={logo}
            className="block h-16 w-auto object-contain"
            alt="DAYate"
          />
        </NavLink>

        {/* Navigation */}
        <div className="flex items-center gap-6 sm:gap-8">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/about" className={linkClass}>
            About Us
          </NavLink>

          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>

          {isLoggedIn ? (
            <>
              <NavLink to={dashboardPath} className={linkClass}>
                Dashboard
              </NavLink>

              {role === "user" && (
                <NavLink to="/profile" className={linkClass}>
                  Profile
                </NavLink>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Sign in
              </NavLink>

              <NavLink
                to="/register"
                className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Get started
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
