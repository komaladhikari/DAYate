import { v2 as cloudinary } from "cloudinary";
import {
  findAccessiblePlan,
  listAccessiblePlans,
  listSharedPlans,
} from "../plans/plan.service.js";
import {
  createMessage,
  listImagesForPlans,
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

const listCalendar = async (req, res) => {
  try {
    const plans = await listAccessiblePlans(req.userId).sort({ date: -1 });
    const images = await listImagesForPlans(plans.map((plan) => plan._id));

    const imagesByPlan = images.reduce((grouped, image) => {
      const planId = image.plan.toString();
      grouped[planId] = grouped[planId] || [];
      grouped[planId].push(image);
      return grouped;
    }, {});

    const calendar = plans
      .map((plan) => ({
        ...plan.toObject(),
        images: imagesByPlan[plan._id.toString()] || [],
      }))
      .filter((plan) => plan.images.length > 0);

    res.json({ success: true, data: calendar });
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

export { listCalendar, listChats, listMessages, sendMessage };
