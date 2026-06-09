import { v2 as cloudinary } from "cloudinary";
import DatePlan from "../models/productModel.js";
import Message from "../models/messageModel.js";

const findAccessiblePlan = (planId, userId) =>
  DatePlan.findOne({
    _id: planId,
    $or: [{ createdBy: userId }, { partner: userId }],
  });

const listChats = async (req, res) => {
  try {
    const plans = await DatePlan.find({
      partner: { $ne: null },
      $or: [{ createdBy: req.userId }, { partner: req.userId }],
    })
      .populate("createdBy", "name email profilePicture")
      .populate("partner", "name email profilePicture")
      .sort({ updatedAt: -1 });

    res.json({ success: true, data: plans });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const listMessages = async (req, res) => {
  try {
    const plan = await findAccessiblePlan(req.params.planId, req.userId);

    if (!plan) {
      return res.status(403).json({ success: false, message: "Chat not found" });
    }

    const messages = await Message.find({ plan: plan._id })
      .populate("sender", "name email profilePicture")
      .sort({ createdAt: 1 })
      .limit(200);

    res.json({ success: true, data: messages });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const plan = await findAccessiblePlan(req.params.planId, req.userId);

    if (!plan) {
      return res.status(403).json({ success: false, message: "Chat not found" });
    }

    const text = req.body.text?.trim() || "";
    let imageUrl = "";

    if (req.file) {
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

    const message = await Message.create({
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
