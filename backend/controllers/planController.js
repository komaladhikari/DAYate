import DatePlan from "../models/productModel.js";

const addPlan = async (req, res) => {
  try {
    const { name, date, time, location, title, from, to } = req.body;

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
    const plans = await DatePlan.find({createdBy: req.userId});
    res.json({ success: true, data: plans });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { addPlan, listPlans };