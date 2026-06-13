import express from "express";
import authUser from "../../shared/middleware/authUser.js";
import { sharePlan } from "./share.controller.js";

const shareRouter = express.Router();

shareRouter.post("/", authUser, sharePlan);

export default shareRouter;
