const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

const parseResponse = async (response, fallbackMessage) => {
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || fallbackMessage);
  }

  return data;
};

const getDashboardData = async ({ signal } = {}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please sign in to view your dashboard.");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [profileResponse, plansResponse] = await Promise.all([
    fetch(`${API}/api/user/profile`, { headers, signal }),
    fetch(`${API}/api/plan/list?scope=accessible`, { headers, signal }),
  ]);

  const [profileData, plansData] = await Promise.all([
    parseResponse(profileResponse, "Could not load your profile."),
    parseResponse(plansResponse, "Could not load your plans."),
  ]);

  return {
    user: profileData.user,
    plans: plansData.data,
  };
};

export { getDashboardData };
