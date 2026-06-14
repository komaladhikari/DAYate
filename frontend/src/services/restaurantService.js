const API = import.meta.env.VITE_API_URL || "https://dayate-zw7n.onrender.com";

const getNearbyRestaurants = async ({
  latitude,
  longitude,
  radius = 5000,
  signal,
}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please sign in to discover nearby restaurants.");
  }

  const params = new URLSearchParams({
    lat: latitude,
    lng: longitude,
    radius,
  });

  const response = await fetch(`${API}/api/restaurants/nearby?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Could not load nearby restaurants.");
  }

  return data.data.restaurants;
};

export { getNearbyRestaurants };
