import express from "express";
import { addPlan, listPlans } from "../controllers/planController.js";
import authUser from "../middleware/authUser.js";


const planRouter = express.Router();

planRouter.post("/add", authUser, addPlan);
planRouter.get("/list", authUser, listPlans);

export default planRouter;