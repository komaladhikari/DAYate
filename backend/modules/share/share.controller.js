import { sharePlanWithPartner } from "./share.service.js";

const sharePlan = async (req, res) => {
  try {
    const plan = await sharePlanWithPartner({
      planId: req.body.planId,
      lovedOneEmail: req.body.lovedOneEmail,
      userId: req.userId,
    });

    res.json({
      success: true,
      message: "Plan shared successfully",
      data: plan,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { sharePlan };
