const API = import.meta.env.VITE_API_URL || "https://dayate-zw7n.onrender.com";

const getAdminDashboard = async ({ signal } = {}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please sign in as admin.");
  }

  const response = await fetch(`${API}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Could not load admin dashboard.");
  }

  return data.data;
};

const updateBusinessApproval = async ({ businessId, approvalStatus }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please sign in as admin.");
  }

  const response = await fetch(
    `${API}/api/admin/businesses/${businessId}/approval`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ approvalStatus }),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Could not update business approval.");
  }

  return data.data;
};

export { getAdminDashboard, updateBusinessApproval };
