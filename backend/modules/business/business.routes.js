import express from "express";
import authUser from "../../shared/middleware/authUser.js";
import { showBusinessDashboard } from "./business.controller.js";

const businessRouter = express.Router();

businessRouter.get("/dashboard", authUser, showBusinessDashboard);

export default businessRouter;
