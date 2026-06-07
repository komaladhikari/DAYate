import React, { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

const MyPlans = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const getPlans = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/plan/list`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (data.success) {
        setPlans(data.data);
      }
    };

    getPlans();
  }, []);

  return (
    <section className="py-10 sm:py-14 lg:py-20">
      <h1 className="mb-8 text-4xl font-black">My Planned Dates</h1>

      {plans.length === 0 ? (
        <p className="text-slate-600">No date plans yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <div key={plan._id} className="rounded-3xl bg-white p-6 shadow-lg">
              <h2 className="text-2xl font-bold">{plan.name}</h2>

              <p className="mt-2 text-sm text-slate-600">
                Date: {new Date(plan.date).toLocaleDateString()}
              </p>

              <p className="mt-2 text-sm">
                Status: <span className="font-semibold">{plan.status}</span>
              </p>

              <div className="mt-4">
                <h3 className="font-bold">Activities</h3>

                {plan.activities?.map((activity, index) => (
                  <div key={index} className="mt-3 rounded-2xl bg-rose-50 p-4">
                    <p className="font-semibold">{activity.title}</p>
                    <p className="text-sm text-slate-600">
                      Type: {activity.type}
                    </p>
                    <p className="text-sm text-slate-600">
                      Location: {activity.location}
                    </p>
                    <p className="text-sm text-slate-600">
                      Time: {new Date(activity.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm text-slate-600">
                      Booking: {activity.bookingStatus}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyPlans;