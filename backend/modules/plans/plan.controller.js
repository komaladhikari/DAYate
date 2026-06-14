import DatePlan from "./plan.model.js";
import { findUserById } from "../auth/index.js";
import {
  createSystemMessage,
  deleteMessagesForPlan,
} from "../chat/chat.service.js";

const addSystemMessage = (plan, text) =>
  createSystemMessage(plan._id, text);

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const normalizeActivities = (activities = []) =>
  activities.map((activity) => ({
    type: activity.type || "",
    title: activity.title || "",
    time: activity.time ? new Date(activity.time).toISOString() : null,
    location: activity.location || "",
    from: activity.from || "",
    to: activity.to || "",
    providerPlaceId: activity.providerPlaceId || "",
    address: activity.address || "",
    coordinates: {
      latitude: activity.coordinates?.latitude ?? null,
      longitude: activity.coordinates?.longitude ?? null,
    },
    mapsUrl: activity.mapsUrl || "",
    rating: activity.rating ?? null,
    reviewCount: activity.reviewCount ?? 0,
    priceLevel: activity.priceLevel || "",
    bookingStatus: activity.bookingStatus || "",
  }));

const describePlanChanges = (plan, updates) => {
  const changes = [];

  if (updates.name !== undefined && updates.name !== plan.name) {
    changes.push(`renamed the date from "${plan.name}" to "${updates.name}"`);
  }

  if (
    updates.date !== undefined &&
    formatDate(updates.date) !== formatDate(plan.date)
  ) {
    changes.push(
      `changed the date from ${formatDate(plan.date)} to ${formatDate(updates.date)}`
    );
  }

  if (
    updates.budget !== undefined &&
    Number(updates.budget) !== Number(plan.budget)
  ) {
    changes.push(`changed the budget from $${plan.budget} to $${updates.budget}`);
  }

  if (updates.status !== undefined && updates.status !== plan.status) {
    changes.push(`changed the status from ${plan.status} to ${updates.status}`);
  }

  if (
    updates.activities !== undefined &&
    JSON.stringify(normalizeActivities(updates.activities)) !==
      JSON.stringify(normalizeActivities(plan.activities))
  ) {
    changes.push("updated the date activities");
  }

  return changes;
};

const addPlan = async (req, res) => {
  try {
    const {
      name,
      date,
      time,
      location,
      title,
      type,
      from,
      to,
      providerPlaceId,
      address,
      coordinates,
      mapsUrl,
      rating,
      reviewCount,
      priceLevel,
    } = req.body;

    const plan = new DatePlan({
      name,
      date,
      createdBy: req.userId,
      activities: [
        {
          type: type || "restaurant",
          title,
          time,
          location,
          from,
          to,
          providerPlaceId,
          address,
          coordinates,
          mapsUrl,
          rating,
          reviewCount,
          priceLevel,
          bookingStatus: "pending",
        },
      ],
    });

    await plan.save();

    res.json({ success: true, message: "Plan added", data: plan });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const listPlans = async (req, res) => {
  try {
    const query =
      req.query.scope === "accessible"
        ? { $or: [{ createdBy: req.userId }, { partner: req.userId }] }
        : { createdBy: req.userId };

    if (req.query.finalized === "true") {
      query.finalized = true;
    } else if (req.query.finalized === "false") {
      query.finalized = false;
    }

    const plans = await DatePlan.find(query)
      .populate("createdBy", "name")
      .populate("partner", "name")
      .sort({ date: 1 });

    res.json({ success: true, data: plans });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const finalizePlans = async (req, res) => {
  try {
    const { planIds } = req.body;

    const plans = await DatePlan.find({
      _id: { $in: planIds },
      createdBy: req.userId,
      finalized: false,
    });

    await Promise.all(
      plans.map(async (plan) => {
        plan.finalized = true;
        plan.status = "planned";
        await plan.save();

        if (plan.partner) {
          await addSystemMessage(plan, "The date plan was finalized.");
        }
      })
    );

    res.json({ success: true, message: "Plans finalized" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updatePlan = async (req, res) => {
  try {
    const plan = await DatePlan.findOne({
      _id: req.params.planId,
      $or: [{ createdBy: req.userId }, { partner: req.userId }],
    });

    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan not found" });
    }

    const allowedFields = ["name", "date", "budget", "status", "activities"];
    const changedFields = allowedFields.filter(
      (field) => req.body[field] !== undefined
    );

    if (changedFields.length === 0) {
      return res.json({ success: false, message: "No plan updates provided" });
    }

    const changes = describePlanChanges(plan, req.body);

    if (changes.length === 0) {
      return res.json({ success: false, message: "Nothing changed" });
    }

    changedFields.forEach((field) => {
      plan[field] = req.body[field];
    });
    await plan.save();

    if (plan.partner) {
      const actor = await findUserById(req.userId);
      await addSystemMessage(
        plan,
        `${actor?.name || "Someone"} ${changes.join(" and ")}.`
      );
    }

    res.json({ success: true, message: "Plan updated", data: plan });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const deletePlan = async (req, res) => {
  try {
    const plan = await DatePlan.findOne({
      _id: req.params.planId,
      createdBy: req.userId,
    });

    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan not found" });
    }

    await Promise.all([
      deleteMessagesForPlan(plan._id),
      plan.deleteOne(),
    ]);

    res.json({ success: true, message: "Plan deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  addPlan,
  deletePlan,
  finalizePlans,
  listPlans,
  updatePlan,
};
