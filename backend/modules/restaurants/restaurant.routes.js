import express from "express";
import authUser from "../../shared/middleware/authUser.js";
import { listNearbyRestaurants } from "./restaurant.controller.js";

const restaurantRouter = express.Router();

restaurantRouter.get("/nearby", authUser, listNearbyRestaurants);

export default restaurantRouter;
