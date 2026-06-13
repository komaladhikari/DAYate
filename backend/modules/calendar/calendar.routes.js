import express from "express";
import authUser from "../../shared/middleware/authUser.js";
import { listCalendar } from "./calendar.controller.js";

const calendarRouter = express.Router();

calendarRouter.get("/", authUser, listCalendar);

export default calendarRouter;
