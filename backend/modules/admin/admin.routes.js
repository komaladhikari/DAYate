import express from "express";
import authUser from "../../shared/middleware/authUser.js";
import {
  reviewBusinessApproval,
  showAdminDashboard,
} from "./admin.controller.js";

const adminRouter = express.Router();

adminRouter.get("/dashboard", authUser, showAdminDashboard);
adminRouter.patch(
  "/businesses/:businessId/approval",
  authUser,
  reviewBusinessApproval
);

export default adminRouter;
