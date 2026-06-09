import DatePlan from "../models/productModel.js";
import sendEmail from "../models/sendEmail.js";

const addPlan = async (req, res) => {
  try {
    const { name, date, time, location, title, type, from, to } = req.body;

    const plan = new DatePlan({
      name,
      date,
      createdBy: req.userId,
      activities: [
        {
          type,
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
    const plans = await DatePlan.find({createdBy: req.userId});
    res.json({ success: true, data: plans });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const sharePlan = async (req, res) => {
  try {
    const { planId, lovedOneEmail } = req.body;

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
          Hope you have the sweetest time together.
        </p>

        <p>— DAYate</p>
      </div>
    `;

    await sendEmail({
      to: lovedOneEmail,
      subject: `${plan.name} 💛`,
      html,
    });

    res.json({
      success: true,
      message: "Plan shared successfully",
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

    await DatePlan.updateMany(
      { _id: { $in: planIds }, createdBy: req.userId },
      { finalized: true }
    );

    res.json({ success: true, message: "Plans finalized" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { addPlan, listPlans, sharePlan, finalizePlans };
