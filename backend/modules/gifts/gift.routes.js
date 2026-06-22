import express from "express";
import authUser from "../../shared/middleware/authUser.js";
import {
  listNearbyGiftShops,
  searchGiftShops,
  showGiftShopPhoto,
} from "./gift.controller.js";

const giftRouter = express.Router();

giftRouter.get("/nearby", authUser, listNearbyGiftShops);
giftRouter.get("/search", authUser, searchGiftShops);
giftRouter.get("/photo", showGiftShopPhoto);

export default giftRouter;
