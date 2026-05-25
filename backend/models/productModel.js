const datePlanSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    partner:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title:     { type: String, required: true },
    date:      { type: Date, required: true },
    budget:    { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "planned", "in_progress", "completed", "cancelled"],
      default: "draft"
    },
    activities: [
      {
        type: { type: String, enum: ["ride", "restaurant", "spa", "movie", "other"] },
        title: String,
        time: Date,
        location: String,
        bookingStatus: { type: String, enum: ["pending", "confirmed", "failed"] }
      }
    ]
  },
  { timestamps: true }
);

const DatePlan =
  mongoose.models.DatePlan || mongoose.model("DatePlan", datePlanSchema);