import OpenAI from "openai";

class AiServiceError extends Error {
  constructor(message, statusCode = 502) {
    super(message);
    this.statusCode = statusCode;
  }
}

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : "";

const normalizeIdeas = (ideas) =>
  ideas.slice(0, 3).map((idea) => ({
    title: normalizeText(idea.title),
    description: normalizeText(idea.description),
    estimatedCost: normalizeText(idea.estimatedCost),
    bestTime: normalizeText(idea.bestTime),
    activities: Array.isArray(idea.activities)
      ? idea.activities.map(normalizeText).filter(Boolean)
      : [],
  }));

const generateDateIdeas = async ({ mood, budget, location, interests }) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new AiServiceError("AI ideas are not configured yet.", 500);
  }

  const client = new OpenAI({ apiKey });

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'You generate personalized date ideas. Return JSON only in this exact shape: {"ideas":[{"title":"","description":"","estimatedCost":"","bestTime":"","activities":[]}]}',
        },
        {
          role: "user",
          content: [
            "Create exactly 3 thoughtful date ideas using these preferences.",
            `Mood: ${mood}`,
            `Budget: ${budget}`,
            `Location: ${location}`,
            `Interests: ${interests}`,
            "Keep descriptions concise, practical, and location-aware when possible.",
          ].join("\n"),
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content || "{}");

    if (!Array.isArray(parsed.ideas)) {
      throw new Error("OpenAI returned an invalid ideas payload");
    }

    return { ideas: normalizeIdeas(parsed.ideas) };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new AiServiceError("AI returned an unexpected response.", 502);
    }

    if (error instanceof AiServiceError) {
      throw error;
    }

    if (error.status === 401) {
      throw new AiServiceError("AI ideas are not configured correctly.", 500);
    }

    if (error.status === 429) {
      throw new AiServiceError(
        "AI ideas are temporarily unavailable because the OpenAI account has reached its quota.",
        503
      );
    }

    throw new AiServiceError("Could not generate date ideas right now.", 502);
  }
};

export { generateDateIdeas };
