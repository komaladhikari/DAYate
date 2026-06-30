import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || "user";

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    const destination =
      role === "admin"
        ? "/admin/dashboard"
        : role === "business"
          ? "/business/dashboard"
          : "/dashboard";

    return <Navigate to={destination} replace />;
  }

  return children;
};

export default ProtectedRoute;
