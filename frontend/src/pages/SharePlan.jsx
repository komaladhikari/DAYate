import React, { useEffect, useState } from "react";

const PlannedDates = () => {
  const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const [plans, setPlans] = useState([]);
  const [emails, setEmails] = useState({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchPlans = async () => {
    try {
      const res = await fetch(`${API}/api/plan/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setPlans(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (planId) => {
    const lovedOneEmail = emails[planId];

    if (!lovedOneEmail) {
      alert("Please enter an email address");
      return;
    }

    try {
      const res = await fetch(`${API}/api/plan/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          planId,
          lovedOneEmail,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Plan shared successfully 💛");
        setEmails({ ...emails, [planId]: "" });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (!token) {
      alert("Please login first");
      window.location.href = "/login";
      return;
    }

    fetchPlans();
  }, []);

  if (loading) {
    return <p className="p-8">Loading your plans...</p>;
  }

  return (
    <div className="min-h-screen bg-[#fff7ef] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-3xl font-semibold text-[#3b2418]">
          Your Planned Dates
        </h1>

        <p className="mb-8 text-[#7a5a48]">
          Share the plan with someone you care about.
        </p>

        {plans.length === 0 ? (
          <p className="text-[#7a5a48]">You have not planned any dates yet.</p>
        ) : (
          <div className="grid gap-6">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className="rounded-3xl border border-[#f3d6bd] bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <h2 className="text-2xl font-semibold text-[#3b2418]">
                      {plan.name}
                    </h2>

                    <p className="mt-1 text-sm text-[#8a6a57]">
                      {new Date(plan.date).toDateString()}
                    </p>
                  </div>
                </div>

                <div className="mb-6 space-y-3">
                  {plan.activities?.map((activity, index) => (
                    <div
                      key={index}
                      className="rounded-2xl bg-[#fff3e7] p-4 text-sm text-[#4b2f22]"
                    >
                      <p className="font-semibold">{activity.title}</p>
                      <p>Type: {activity.type}</p>
                      <p>Time: {activity.time}</p>
                      <p>Location: {activity.location}</p>
                      <p>Status: {activity.bookingStatus}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    placeholder="Loved one's email"
                    value={emails[plan._id] || ""}
                    onChange={(e) =>
                      setEmails({
                        ...emails,
                        [plan._id]: e.target.value,
                      })
                    }
                    className="w-full rounded-full border border-[#e5c4aa] px-5 py-3 text-sm outline-none focus:border-[#ff9847]"
                  />

                  <button
                    onClick={() => handleShare(plan._id)}
                    className="rounded-full bg-[#ff9847] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e87f30]"
                  >
                    Share Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlannedDates;
