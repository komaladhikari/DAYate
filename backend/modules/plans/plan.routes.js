import express from "express";
import {
  addPlan,
  deletePlan,
  finalizePlans,
  listPlans,
  sharePlan,
  updatePlan,
} from "./plan.controller.js";
import authUser from "../../shared/middleware/authUser.js";


const planRouter = express.Router();

planRouter.post("/add", authUser, addPlan);
planRouter.get("/list", authUser, listPlans);
planRouter.post("/share", authUser, sharePlan);
planRouter.post("/finalize", authUser, finalizePlans);
planRouter.patch("/:planId", authUser, updatePlan);
planRouter.delete("/:planId", authUser, deletePlan);

export default planRouter;
