const API = import.meta.env.VITE_API_URL || "https://dayate-zw7n.onrender.com";

const getGiftPhotoUrl = (photoName, width = 800, height = 600) => {
  if (!photoName) return "";

  const params = new URLSearchParams({
    name: photoName,
    width,
    height,
  });

  return `${API}/api/gifts/photo?${params}`;
};

const getNearbyGiftShops = async ({
  latitude,
  longitude,
  radius = 5000,
  type = "all",
  signal,
}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please sign in to discover nearby gift shops.");
  }

  const params = new URLSearchParams({
    lat: latitude,
    lng: longitude,
    radius,
    type,
  });

  const response = await fetch(`${API}/api/gifts/nearby?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Could not load nearby gift shops.");
  }

  return data.data.shops;
};

const searchGiftShops = async ({ query, type = "all", signal }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please sign in to search gift shops.");
  }

  const params = new URLSearchParams({ query, type });
  const response = await fetch(`${API}/api/gifts/search?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Could not search gift shops.");
  }

  return data.data.shops;
};

export { getGiftPhotoUrl, getNearbyGiftShops, searchGiftShops };
