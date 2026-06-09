import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DatePlan",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    type: {
      type: String,
      enum: ["text", "image", "system"],
      required: true,
    },
    text: { type: String, trim: true, maxlength: 2000, default: "" },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
