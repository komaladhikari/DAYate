import OpenAI from "openai";

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
    throw new Error("OpenAI API key is not configured");
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
      throw new Error("OpenAI returned invalid JSON");
    }

    throw new Error(error.message || "Could not generate date ideas");
  }
};

export { generateDateIdeas };
