import express from "express";
import {
  addPlan,
  finalizePlans,
  listPlans,
  sharePlan,
  updatePlan,
} from "../controllers/planController.js";
import authUser from "../middleware/authUser.js";


const planRouter = express.Router();

planRouter.post("/add", authUser, addPlan);
planRouter.get("/list", authUser, listPlans);
planRouter.post("/share", authUser, sharePlan);
planRouter.post("/finalize", authUser, finalizePlans);
planRouter.patch("/:planId", authUser, updatePlan);

export default planRouter;
