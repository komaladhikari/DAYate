import DatePlan from "../plans/plan.model.js";
import { findUserById } from "../auth/index.js";

const escapeRegExp = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const startOfDay = (date) => {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
};

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const formatDay = (date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

const getMatchingRestaurantActivity = (plan, business, businessPattern) =>
  plan.activities.find((activity) => {
    if (activity.type !== "restaurant") return false;

    if (activity.businessId && String(activity.businessId) === String(business._id)) {
      return true;
    }

    return [activity.title, activity.location, activity.address].some((value) =>
      businessPattern.test(value || "")
    );
  });

const getBusinessDashboard = async (businessUserId) => {
  const business = await findUserById(businessUserId);

  if (!business || business.role !== "business") {
    const error = new Error("Business account not found");
    error.statusCode = 404;
    throw error;
  }

  const businessName = business.businessName || business.name;
  const businessPattern = new RegExp(escapeRegExp(businessName), "i");
  const today = startOfDay(new Date());
  const weekStart = today;
  const weekEnd = addDays(weekStart, 7);
  const previousWeekStart = addDays(weekStart, -7);

  const candidatePlans = await DatePlan.find({
    "activities.type": "restaurant",
    $or: [
      { "activities.businessId": business._id },
      { "activities.title": businessPattern },
      { "activities.location": businessPattern },
      { "activities.address": businessPattern },
    ],
  })
    .populate("createdBy", "name email")
    .sort({ date: 1, createdAt: 1 });

  const selections = candidatePlans
    .map((plan) => ({
      plan,
      activity: getMatchingRestaurantActivity(plan, business, businessPattern),
    }))
    .filter(({ activity }) => Boolean(activity));

  const selectionsThisWeek = selections.filter(({ plan }) => {
    const planDate = new Date(plan.date);
    return planDate >= weekStart && planDate < weekEnd;
  });

  const selectionsLastWeek = selections.filter(({ plan }) => {
    const planDate = new Date(plan.date);
    return planDate >= previousWeekStart && planDate < weekStart;
  });

  const reservations = selections
    .map(({ plan, activity }) => ({
      id: plan._id,
      customerId: plan.createdBy?._id || plan.createdBy || "",
      customerEmail: plan.createdBy?.email || "",
      names: plan.createdBy?.name || "DAYate customer",
      date: plan.date,
      time: activity.time || plan.date,
      people: plan.partner ? "2 people" : "1 person",
      status: activity.bookingStatus || plan.status || "pending",
      planName: plan.name,
      createdAt: plan.createdAt,
    }));

  const upcomingReservations = reservations
    .filter(({ date }) => new Date(date) >= today)
    .slice(0, 6);

  const chart = Array.from({ length: 7 }, (_, index) => {
    const dayStart = addDays(weekStart, index);
    const dayEnd = addDays(dayStart, 1);
    const count = selections.filter(({ plan }) => {
      const planDate = new Date(plan.date);
      return planDate >= dayStart && planDate < dayEnd;
    }).length;

    return {
      label: formatDay(dayStart),
      count,
    };
  });

  const repeatCustomers = selections.reduce((customers, { plan }) => {
    const customerId = String(plan.createdBy?._id || plan.createdBy || "");
    if (!customerId) return customers;

    customers.set(customerId, (customers.get(customerId) || 0) + 1);
    return customers;
  }, new Map());

  const popularItems = Array.from(
    selections.reduce((items, { activity }) => {
      const label = activity.title || businessName;
      items.set(label, (items.get(label) || 0) + 1);
      return items;
    }, new Map())
  )
    .map(([title, count]) => ({ title, count }))
    .sort((first, second) => second.count - first.count)
    .slice(0, 3);

  const selectionGrowth = selectionsLastWeek.length
    ? Math.round(
        ((selectionsThisWeek.length - selectionsLastWeek.length) /
          selectionsLastWeek.length) *
          100
      )
    : selectionsThisWeek.length > 0
      ? 100
      : 0;

  return {
    business: {
      name: businessName,
      ownerName: business.name,
      type: business.businessType,
      email: business.email,
      phone: business.phone || "",
      address: business.address || "",
    },
    metrics: {
      totalSelections: selections.length,
      selectionsThisWeek: selectionsThisWeek.length,
      selectionGrowth,
      upcomingReservations: reservations.filter(({ date }) => new Date(date) >= today).length,
      repeatCustomers: Array.from(repeatCustomers.values()).filter((count) => count > 1).length,
      estimatedRevenue: selectionsThisWeek.length * 35,
      averagePartySize:
        upcomingReservations.length > 0
          ? Number(
              (
                upcomingReservations.reduce(
                  (total, reservation) =>
                    total + (reservation.people.startsWith("2") ? 2 : 1),
                  0
                ) / upcomingReservations.length
              ).toFixed(1)
            )
          : 0,
    },
    chart,
    reservations,
    upcomingReservations,
    popularItems,
    generatedAt: new Date().toISOString(),
  };
};

export { getBusinessDashboard };
