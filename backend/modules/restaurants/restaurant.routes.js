import express from "express";
import authUser from "../../shared/middleware/authUser.js";
import {
  listNearbyRestaurants,
  searchRestaurants,
} from "./restaurant.controller.js";

const restaurantRouter = express.Router();

restaurantRouter.get("/nearby", authUser, listNearbyRestaurants);
restaurantRouter.get("/search", authUser, searchRestaurants);

export default restaurantRouter;
