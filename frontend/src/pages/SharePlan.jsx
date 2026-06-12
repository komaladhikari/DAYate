import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "https://dayate-zw7n.onrender.com";

const PlannedDates = () => {
  const [plans, setPlans] = useState([]);
  const [emails, setEmails] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingPlanId, setEditingPlanId] = useState("");
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  const toDateInput = (value) =>
    value ? new Date(value).toISOString().slice(0, 10) : "";

  const toDateTimeInput = (value) => {
    if (!value) return "";
    const date = new Date(value);
    const offset = date.getTimezoneOffset() * 60 * 1000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  };

  const startEditing = (plan) => {
    setEditingPlanId(plan._id);
    setEditForm({
      name: plan.name || "",
      date: toDateInput(plan.date),
      budget: plan.budget ?? 0,
      status: plan.status || "planned",
      activities: (plan.activities || []).map((activity) => ({
        ...activity,
        time: toDateTimeInput(activity.time),
      })),
    });
  };

  const updateActivity = (index, field, value) => {
    setEditForm((current) => ({
      ...current,
      activities: current.activities.map((activity, activityIndex) =>
        activityIndex === index ? { ...activity, [field]: value } : activity
      ),
    }));
  };

  const savePlan = async (planId) => {
    setSaving(true);

    try {
      const res = await fetch(`${API}/api/plan/${planId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...editForm,
          date: new Date(`${editForm.date}T00:00:00.000Z`).toISOString(),
          activities: editForm.activities.map((activity) => ({
            ...activity,
            time: activity.time ? new Date(activity.time).toISOString() : null,
          })),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Could not update plan");
        return;
      }

      setPlans((current) =>
        current.map((plan) => (plan._id === planId ? data.data : plan))
      );
      setEditingPlanId("");
      setEditForm(null);
      alert("Plan updated. Your partner was notified in chat.");
    } catch (error) {
      console.log(error);
      alert("Could not update plan");
    } finally {
      setSaving(false);
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

  const removePlan = async (planId) => {
    if (!window.confirm("Remove this shared plan?")) {
      return;
    }

    try {
      const res = await fetch(`${API}/api/plan/${planId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Could not remove plan");
        return;
      }

      setPlans((prev) => prev.filter((plan) => plan._id !== planId));
      setEmails((prev) => {
        const updatedEmails = { ...prev };
        delete updatedEmails[planId];
        return updatedEmails;
      });
    } catch (error) {
      console.log(error);
      alert("Could not remove plan");
    }
  };

  useEffect(() => {
    if (!token) {
      alert("Please login first");
      window.location.href = "/login";
      return;
    }

    const fetchPlans = async () => {
      try {
        const res = await fetch(`${API}/api/plan/list?finalized=true`, {
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

    fetchPlans();
  }, [token]);

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
                {editingPlanId === plan._id && editForm ? (
                  <div className="mb-6 space-y-4 rounded-2xl bg-[#fff7ef] p-5">
                    <h3 className="text-lg font-semibold text-[#3b2418]">
                      Edit date plan
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="text-sm font-medium text-[#4b2f22]">
                        Plan name
                        <input
                          value={editForm.name}
                          onChange={(event) =>
                            setEditForm({ ...editForm, name: event.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-[#e5c4aa] px-4 py-3"
                        />
                      </label>

                      <label className="text-sm font-medium text-[#4b2f22]">
                        Date
                        <input
                          type="date"
                          value={editForm.date}
                          onChange={(event) =>
                            setEditForm({ ...editForm, date: event.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-[#e5c4aa] px-4 py-3"
                        />
                      </label>

                      <label className="text-sm font-medium text-[#4b2f22]">
                        Budget
                        <input
                          type="number"
                          min="0"
                          value={editForm.budget}
                          onChange={(event) =>
                            setEditForm({ ...editForm, budget: event.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-[#e5c4aa] px-4 py-3"
                        />
                      </label>

                      <label className="text-sm font-medium text-[#4b2f22]">
                        Status
                        <select
                          value={editForm.status}
                          onChange={(event) =>
                            setEditForm({ ...editForm, status: event.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-[#e5c4aa] px-4 py-3"
                        >
                          <option value="planned">Planned</option>
                          <option value="in_progress">In progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </label>
                    </div>

                    {editForm.activities.map((activity, index) => (
                      <div
                        key={activity._id || index}
                        className="grid gap-3 rounded-2xl border border-[#f3d6bd] bg-white p-4 sm:grid-cols-2"
                      >
                        <input
                          value={activity.title || ""}
                          onChange={(event) =>
                            updateActivity(index, "title", event.target.value)
                          }
                          placeholder="Activity title"
                          className="rounded-xl border border-[#e5c4aa] px-4 py-3"
                        />
                        <input
                          value={activity.location || ""}
                          onChange={(event) =>
                            updateActivity(index, "location", event.target.value)
                          }
                          placeholder="Location"
                          className="rounded-xl border border-[#e5c4aa] px-4 py-3"
                        />
                        <input
                          type="datetime-local"
                          value={activity.time || ""}
                          onChange={(event) =>
                            updateActivity(index, "time", event.target.value)
                          }
                          className="rounded-xl border border-[#e5c4aa] px-4 py-3"
                        />
                        <select
                          value={activity.bookingStatus || "pending"}
                          onChange={(event) =>
                            updateActivity(
                              index,
                              "bookingStatus",
                              event.target.value
                            )
                          }
                          className="rounded-xl border border-[#e5c4aa] px-4 py-3"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="failed">Failed</option>
                        </select>
                      </div>
                    ))}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => savePlan(plan._id)}
                        className="rounded-full bg-[#ff9847] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPlanId("");
                          setEditForm(null);
                        }}
                        className="rounded-full border border-[#e5c4aa] px-6 py-3 text-sm font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}

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

                  <button
                    type="button"
                    onClick={() => startEditing(plan)}
                    className="rounded-full border border-[#ff9847] px-6 py-3 text-sm font-semibold text-[#d76c1d] transition hover:bg-orange-50"
                  >
                    Edit Plan
                  </button>

                  <button
                    type="button"
                    onClick={() => removePlan(plan._id)}
                    className="rounded-full border border-red-300 px-6 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Remove Plan
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
