const API = import.meta.env.VITE_API_URL || "https://dayate-zw7n.onrender.com";

const getBusinessDashboard = async ({ signal } = {}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please sign in with a business account.");
  }

  const response = await fetch(`${API}/api/business/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Could not load business dashboard.");
  }

  return data.data;
};

export { getBusinessDashboard };
