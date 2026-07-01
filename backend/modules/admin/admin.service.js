import DatePlan from "../plans/plan.model.js";
import Message from "../chat/message.model.js";
import User from "../auth/user.model.js";

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

const getGrowth = (current, previous) => {
  if (previous > 0) {
    return Math.round(((current - previous) / previous) * 1000) / 10;
  }

  return current > 0 ? 100 : 0;
};

const requireAdmin = (userId) => {
  if (userId !== "admin") {
    const error = new Error("Admin access required");
    error.statusCode = 403;
    throw error;
  }
};

const countCreatedBetween = (model, query, start, end) =>
  model.countDocuments({
    ...query,
    createdAt: { $gte: start, $lt: end },
  });

const getBusinessSelectionCount = async (businessName) => {
  const pattern = new RegExp(escapeRegExp(businessName), "i");

  return DatePlan.countDocuments({
    "activities.type": "restaurant",
    $or: [
      { "activities.title": pattern },
      { "activities.location": pattern },
      { "activities.address": pattern },
    ],
  });
};

const getAdminDashboard = async (adminUserId) => {
  requireAdmin(adminUserId);

  const today = startOfDay(new Date());
  const weekStart = today;
  const weekEnd = addDays(weekStart, 7);
  const previousWeekStart = addDays(weekStart, -7);

  const [
    totalUsers,
    totalBusinesses,
    totalPlans,
    pendingBusinesses,
    recentUsers,
    recentPendingBusinesses,
    businesses,
    messagesThisWeek,
    messagesLastWeek,
    photosThisWeek,
  ] = await Promise.all([
    User.countDocuments({ role: "user" }),
    User.countDocuments({ role: "business" }),
    DatePlan.countDocuments(),
    User.countDocuments({
      role: "business",
      $or: [{ approvalStatus: "pending" }, { approvalStatus: { $exists: false } }],
    }),
    User.find({ role: "user" })
      .select("name email createdAt")
      .sort({ createdAt: -1 })
      .limit(5),
    User.find({
      role: "business",
      $or: [{ approvalStatus: "pending" }, { approvalStatus: { $exists: false } }],
    })
      .select("businessName businessType address createdAt approvalStatus")
      .sort({ createdAt: -1 })
      .limit(5),
    User.find({ role: "business" })
      .select("businessName businessType address createdAt approvalStatus")
      .sort({ createdAt: -1 }),
    Message.countDocuments({ createdAt: { $gte: weekStart, $lt: weekEnd } }),
    Message.countDocuments({ createdAt: { $gte: previousWeekStart, $lt: weekStart } }),
    Message.countDocuments({
      type: "image",
      createdAt: { $gte: weekStart, $lt: weekEnd },
    }),
  ]);

  const [
    usersThisWeek,
    usersLastWeek,
    businessesThisWeek,
    businessesLastWeek,
    plansThisWeek,
    plansLastWeek,
  ] = await Promise.all([
    countCreatedBetween(User, { role: "user" }, weekStart, weekEnd),
    countCreatedBetween(User, { role: "user" }, previousWeekStart, weekStart),
    countCreatedBetween(User, { role: "business" }, weekStart, weekEnd),
    countCreatedBetween(User, { role: "business" }, previousWeekStart, weekStart),
    countCreatedBetween(DatePlan, {}, weekStart, weekEnd),
    countCreatedBetween(DatePlan, {}, previousWeekStart, weekStart),
  ]);

  const chart = await Promise.all(
    Array.from({ length: 7 }, async (_, index) => {
      const dayStart = addDays(weekStart, index);
      const dayEnd = addDays(dayStart, 1);
      const count = await DatePlan.countDocuments({
        createdAt: { $gte: dayStart, $lt: dayEnd },
      });

      return {
        label: formatDay(dayStart),
        count,
      };
    })
  );

  const activeUserIds = new Set();
  const [activePlans, activeMessages] = await Promise.all([
    DatePlan.find({ createdAt: { $gte: weekStart, $lt: weekEnd } }).select("createdBy"),
    Message.find({ createdAt: { $gte: weekStart, $lt: weekEnd }, sender: { $ne: null } }).select("sender"),
  ]);

  activePlans.forEach((plan) => activeUserIds.add(String(plan.createdBy)));
  activeMessages.forEach((message) => activeUserIds.add(String(message.sender)));

  const topBusinesses = (
    await Promise.all(
      businesses.map(async (business) => ({
        id: business._id,
        name: business.businessName || business.name,
        type: business.businessType || "business",
        address: business.address || "",
        approvalStatus: business.approvalStatus || "pending",
        selections: await getBusinessSelectionCount(business.businessName || business.name),
      }))
    )
  )
    .sort((first, second) => second.selections - first.selections)
    .slice(0, 5);

  const reports = [
    { label: "Reported Users", detail: "No report model connected yet", count: 0, type: "users" },
    { label: "Reported Businesses", detail: "Business review queue", count: pendingBusinesses, type: "businesses" },
    { label: "Inappropriate Content", detail: "Messages/images flagged", count: 0, type: "content" },
    { label: "Other Issues", detail: "Other platform issues", count: 0, type: "other" },
  ];

  return {
    range: {
      startLabel: formatDay(weekStart),
      endLabel: formatDay(addDays(weekEnd, -1)),
    },
    metrics: {
      totalUsers,
      totalBusinesses,
      totalPlans,
      pendingBusinesses,
      reports: reports.reduce((total, report) => total + report.count, 0),
      usersGrowth: getGrowth(usersThisWeek, usersLastWeek),
      businessesGrowth: getGrowth(businessesThisWeek, businessesLastWeek),
      plansGrowth: getGrowth(plansThisWeek, plansLastWeek),
    },
    chart,
    activity: {
      plansCreated: plansThisWeek,
      messagesSent: messagesThisWeek,
      activeUsers: activeUserIds.size,
      photosShared: photosThisWeek,
      plansGrowth: getGrowth(plansThisWeek, plansLastWeek),
      messagesGrowth: getGrowth(messagesThisWeek, messagesLastWeek),
    },
    pendingBusinesses: recentPendingBusinesses.map((business) => ({
      id: business._id,
      name: business.businessName || "Unnamed business",
      type: business.businessType || "business",
      address: business.address || "",
      submittedAt: business.createdAt,
      approvalStatus: business.approvalStatus || "pending",
    })),
    recentUsers: recentUsers.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      joinedAt: user.createdAt,
      status: "active",
    })),
    topBusinesses,
    reports,
    generatedAt: new Date().toISOString(),
  };
};

const updateBusinessApproval = async (adminUserId, businessId, approvalStatus) => {
  requireAdmin(adminUserId);

  if (!["approved", "rejected", "pending"].includes(approvalStatus)) {
    const error = new Error("Invalid approval status");
    error.statusCode = 400;
    throw error;
  }

  const business = await User.findOneAndUpdate(
    { _id: businessId, role: "business" },
    {
      approvalStatus,
      approvalReviewedAt: new Date(),
    },
    { new: true }
  ).select("businessName businessType address approvalStatus createdAt");

  if (!business) {
    const error = new Error("Business not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    id: business._id,
    name: business.businessName || "Unnamed business",
    type: business.businessType || "business",
    address: business.address || "",
    submittedAt: business.createdAt,
    approvalStatus: business.approvalStatus || "pending",
  };
};

export { getAdminDashboard, updateBusinessApproval };
