import { useCallback, useEffect, useState } from "react";
import { getDashboardData } from "../services/dashboardService";

const initialDashboard = {
  user: null,
  plans: [],
  upcomingPlans: [],
  stats: {
    created: 0,
    upcoming: 0,
    completed: 0,
    shared: 0,
  },
};

const getId = (value) => String(value?._id || value || "");
const isSharedPlan = (plan) =>
  Boolean(plan.partner || plan.sharedWithEmail || plan.sharedAt);

const buildDashboard = ({ user, plans }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const userId = getId(user);

  const upcomingPlans = plans
    .filter(
      (plan) =>
        plan.finalized &&
        isSharedPlan(plan) &&
        new Date(plan.date) >= today &&
        plan.status !== "cancelled"
    )
    .sort((first, second) => new Date(first.date) - new Date(second.date));

  return {
    user,
    plans,
    upcomingPlans,
    stats: {
      created: plans.filter((plan) => getId(plan.createdBy) === userId).length,
      upcoming: upcomingPlans.length,
      completed: plans.filter((plan) => plan.status === "completed").length,
      shared: plans.filter(isSharedPlan).length,
    },
  };
};

const useDashboard = () => {
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasData, setHasData] = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getDashboardData();
      setDashboard(buildDashboard(data));
      setHasData(true);
    } catch (requestError) {
      setError(requestError.message || "Could not load your dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    getDashboardData({ signal: controller.signal })
      .then((data) => {
        setDashboard(buildDashboard(data));
        setHasData(true);
        setError("");
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Could not load your dashboard.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  return {
    ...dashboard,
    loading,
    error,
    hasData,
    refetch,
  };
};

export default useDashboard;
