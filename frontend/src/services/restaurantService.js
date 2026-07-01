const API = import.meta.env.VITE_API_URL || "https://dayate-zw7n.onrender.com";

const getRestaurantPhotoUrl = (photoName, width = 800, height = 600) => {
  if (!photoName) return "";

  const params = new URLSearchParams({
    name: photoName,
    width,
    height,
  });

  return `${API}/api/restaurants/photo?${params}`;
};

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

const getRegisteredRestaurants = async ({ signal } = {}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please sign in to view DAYate restaurants.");
  }

  const response = await fetch(`${API}/api/restaurants/registered`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Could not load registered restaurants.");
  }

  return data.data.restaurants;
};

const searchRestaurants = async ({ query, signal }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please sign in to search restaurants.");
  }

  const params = new URLSearchParams({ query });
  const response = await fetch(`${API}/api/restaurants/search?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Could not search restaurants.");
  }

  return data.data.restaurants;
};

export {
  getNearbyRestaurants,
  getRegisteredRestaurants,
  getRestaurantPhotoUrl,
  searchRestaurants,
};
