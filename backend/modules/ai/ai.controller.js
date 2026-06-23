import { generateDateIdeas } from "./ai.service.js";

const requiredFields = ["mood", "budget", "location", "interests"];

const createDateIdeas = async (req, res) => {
  try {
    const missingFields = requiredFields.filter(
      (field) => !req.body[field] || !String(req.body[field]).trim()
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const ideas = await generateDateIdeas({
      mood: String(req.body.mood).trim(),
      budget: String(req.body.budget).trim(),
      location: String(req.body.location).trim(),
      interests: String(req.body.interests).trim(),
    });

    res.json({ success: true, data: ideas });
  } catch (error) {
    const status = error.message.includes("API key") ? 500 : 502;

    res.status(status).json({
      success: false,
      message: error.message || "Could not generate date ideas",
    });
  }
};

export { createDateIdeas };
