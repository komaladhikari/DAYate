import express from "express";
import multer from "multer";
import authUser from "../middleware/authUser.js";
import {
  listCalendar,
  listChats,
  listMessages,
  sendMessage,
} from "../controllers/chatController.js";

const chatRouter = express.Router();
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(new Error("Only image files can be uploaded"));
    }

    callback(null, true);
  },
});

chatRouter.get("/", authUser, listChats);
chatRouter.get("/calendar", authUser, listCalendar);
chatRouter.get("/:planId/messages", authUser, listMessages);
chatRouter.post(
  "/:planId/messages",
  authUser,
  imageUpload.single("image"),
  sendMessage
);

chatRouter.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "Image must be smaller than 8 MB",
    });
  }

  res.status(400).json({
    success: false,
    message: error.message || "Could not upload image",
  });
});

export default chatRouter;
