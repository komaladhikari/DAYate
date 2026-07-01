import {
  getAdminDashboard,
  updateBusinessApproval,
} from "./admin.service.js";

const showAdminDashboard = async (req, res) => {
  try {
    const dashboard = await getAdminDashboard(req.userId);
    res.json({ success: true, data: dashboard });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};

const reviewBusinessApproval = async (req, res) => {
  try {
    const business = await updateBusinessApproval(
      req.userId,
      req.params.businessId,
      req.body.approvalStatus
    );
    res.json({ success: true, data: business });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};

export { reviewBusinessApproval, showAdminDashboard };
