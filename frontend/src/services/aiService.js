const API = import.meta.env.VITE_API_URL || "https://dayate-zw7n.onrender.com";

const generateDateIdeas = async ({ mood, budget, location, interests }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please sign in to explore date ideas.");
  }

  const response = await fetch(`${API}/api/ai/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mood, budget, location, interests }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Could not generate date ideas.");
  }

  return data.data.ideas;
};

export { generateDateIdeas };
