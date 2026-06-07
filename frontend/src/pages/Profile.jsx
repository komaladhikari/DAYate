import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const getProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      if (response.data.success) {
        setUser(response.data.user);
      } else {
        alert(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      alert("Please login first");
      navigate("/login");
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (!user) {
    return <p className="py-10">Loading profile...</p>;
  }

  return (
    <section className="py-10 max-w-xl">
      <h1 className="text-4xl font-black mb-8">My Profile</h1>

      <div className="rounded-2xl bg-white shadow-md p-6">
        <p className="text-slate-500 mb-2">Logged in as</p>
        <h2 className="text-2xl font-bold text-slate-900">{user.email}</h2>
      </div>
    </section>
  );
};

export default Profile;