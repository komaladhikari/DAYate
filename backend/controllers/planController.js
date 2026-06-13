import DatePlan from "../models/productModel.js";
import sendEmail from "../shared/utils/sendEmail.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

const addSystemMessage = (plan, text) =>
  Message.create({ plan: plan._id, type: "system", text });

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
    const { name, date, time, location, title, from, to, } = req.body;

    const plan = new DatePlan({
      name,
      date,
      createdBy: req.userId,
      activities: [
        {
          type: "restaurant",
          title,
          time,
          location,
          from,
          to,
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

const sharePlan = async (req, res) => {
  try {
    const { planId, lovedOneEmail } = req.body;
    const normalizedEmail = lovedOneEmail?.trim().toLowerCase();

    const plan = await DatePlan.findOne({
      _id: planId,
      createdBy: req.userId,
    });

    if (!plan) {
      return res.json({
        success: false,
        message: "Plan not found",
      });
    }

    const [partner, creator] = await Promise.all([
      User.findOne({ email: normalizedEmail }).collation({ locale: "en", strength: 2 }),
      User.findById(req.userId),
    ]);

    if (!partner) {
      return res.json({
        success: false,
        message: "Your loved one needs a DAYate account before they can join the private chat",
      });
    }

    if (partner._id.equals(req.userId)) {
      return res.json({
        success: false,
        message: "Invite your loved one's account, not your own",
      });
    }

    if (plan.partner && !plan.partner.equals(partner._id)) {
      return res.json({
        success: false,
        message: "This date is already shared with another partner",
      });
    }

    plan.partner = partner._id;
    plan.sharedWithEmail = partner.email;
    plan.sharedAt = new Date();
    await plan.save();

    const activitiesHtml = plan.activities
      .map(
        (activity) => `
          <div style="margin-bottom:16px;">
            <h3>${activity.title}</h3>
            <p><strong>Type:</strong> ${activity.type}</p>
            <p><strong>Time:</strong> ${activity.time}</p>
            <p><strong>Location:</strong> ${activity.location}</p>
            <p><strong>Booking Status:</strong> ${activity.bookingStatus}</p>
          </div>
        `
      )
      .join("");

    const html = `
      <div style="font-family: Arial, sans-serif; color:#333;">
        <h2>You have a DAYate planned 💛</h2>

        <p>
          Someone special has planned something for you using DAYate.
          Here are the details:
        </p>

        <h3>${plan.name}</h3>
        <p><strong>Date:</strong> ${new Date(plan.date).toDateString()}</p>

        <hr />

        ${activitiesHtml}

        <p style="margin-top:24px;">
          Sign in to DAYate to chat and receive every update to this date.
        </p>

        <p>— DAYate</p>
      </div>
    `;

    await sendEmail({
      to: partner.email,
      subject: `${plan.name} 💛`,
      html,
    });

    await addSystemMessage(
      plan,
      `${creator?.name || "Your partner"} shared this date with ${partner.name}.`
    );

    res.json({
      success: true,
      message: "Plan shared successfully",
      data: plan,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
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
      const actor = await User.findById(req.userId).select("name");
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
      Message.deleteMany({ plan: plan._id }),
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
  sharePlan,
  updatePlan,
};
