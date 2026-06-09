import express from "express";
import multer from "multer";
import authUser from "../middleware/authUser.js";
import {
  listChats,
  listMessages,
  sendMessage,
} from "../controllers/chatController.js";

const chatRouter = express.Router();
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    callback(null, file.mimetype.startsWith("image/"));
  },
});

chatRouter.get("/", authUser, listChats);
chatRouter.get("/:planId/messages", authUser, listMessages);
chatRouter.post(
  "/:planId/messages",
  authUser,
  imageUpload.single("image"),
  sendMessage
);

export default chatRouter;
