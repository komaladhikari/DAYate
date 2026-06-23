import express from "express";
import authUser from "../../shared/middleware/authUser.js";
import { createDateIdeas } from "./ai.controller.js";

const aiRouter = express.Router();

aiRouter.post("/generate", authUser, createDateIdeas);

export default aiRouter;
