import Message from "./message.model.js";

export const createMessage = (messageData) => Message.create(messageData);

export const createSystemMessage = (planId, text) =>
  Message.create({ plan: planId, type: "system", text });

export const deleteMessagesForPlan = (planId) =>
  Message.deleteMany({ plan: planId });

export const listMessagesForPlan = (planId) =>
  Message.find({ plan: planId })
    .populate("sender", "name email profilePicture")
    .sort({ createdAt: 1 })
    .limit(200);

export const listImagesForPlans = (planIds) =>
  Message.find({
    plan: { $in: planIds },
    imageUrl: { $ne: "" },
  })
    .populate("sender", "name")
    .sort({ createdAt: -1 });
