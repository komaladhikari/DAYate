import express from "express";
import authUser from "../../shared/middleware/authUser.js";
import {
  listNearbyRestaurants,
  listRegisteredRestaurantPartners,
  searchRestaurants,
  showRestaurantPhoto,
} from "./restaurant.controller.js";

const restaurantRouter = express.Router();

restaurantRouter.get("/nearby", authUser, listNearbyRestaurants);
restaurantRouter.get("/registered", authUser, listRegisteredRestaurantPartners);
restaurantRouter.get("/search", authUser, searchRestaurants);
restaurantRouter.get("/photo", showRestaurantPhoto);

export default restaurantRouter;
