import { getBusinessDashboard } from "./business.service.js";

const showBusinessDashboard = async (req, res) => {
  try {
    const dashboard = await getBusinessDashboard(req.userId);
    res.json({ success: true, data: dashboard });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};

export { showBusinessDashboard };
