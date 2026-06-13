import { v2 as cloudinary } from "cloudinary";
import {
  findAccessiblePlan,
  listSharedPlans,
} from "../plans/plan.service.js";
import {
  createMessage,
  listMessagesForPlan,
} from "./chat.service.js";

const listChats = async (req, res) => {
  try {
    const plans = await listSharedPlans(req.userId);

    res.json({ success: true, data: plans });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const listMessages = async (req, res) => {
  try {
    const plan = await findAccessiblePlan({
      planId: req.params.planId,
      userId: req.userId,
    });

    if (!plan) {
      return res.status(403).json({ success: false, message: "Chat not found" });
    }

    const messages = await listMessagesForPlan(plan._id);

    res.json({ success: true, data: messages });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const plan = await findAccessiblePlan({
      planId: req.params.planId,
      userId: req.userId,
    });

    if (!plan) {
      return res.status(403).json({ success: false, message: "Chat not found" });
    }

    const text = req.body.text?.trim() || "";
    let imageUrl = "";

    if (req.file) {
      if (!cloudinary.config().cloud_name) {
        return res.status(500).json({
          success: false,
          message: "Image uploads are not configured",
        });
      }

      const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const upload = await cloudinary.uploader.upload(dataUri, {
        folder: "dayate/chat",
        resource_type: "image",
      });
      imageUrl = upload.secure_url;
    }

    if (!text && !imageUrl) {
      return res.json({ success: false, message: "Write a message or add an image" });
    }

    const message = await createMessage({
      plan: plan._id,
      sender: req.userId,
      type: imageUrl ? "image" : "text",
      text,
      imageUrl,
    });

    await message.populate("sender", "name email profilePicture");
    res.json({ success: true, data: message });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { listChats, listMessages, sendMessage };
