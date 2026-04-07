const { GoogleGenerativeAI } = require("@google/generative-ai");
const { buildScoringPrompt } = require("./prompt");

const DEFAULT_SCORE = {
  score: 0,
  tier: "Newcomer",
  justification: "Scoring failed — insufficient data.",
  strengths: [],
  improvements: [
    "Add onchain activity",
    "Link a GitHub account",
    "Interact with DeFi protocols",
  ],
};

async function scoreWallet(collectedData) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY not set in environment");
      return { ...DEFAULT_SCORE };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = buildScoringPrompt(collectedData);

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
    });

    const response = result.response;
    let text = "";

    
    if (response.candidates && response.candidates[0]) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.text && !part.thought) {
          text += part.text;
        }
      }
    }

    if (!text) {
      text = response.text();
    }

    text = text.trim();
    if (text.startsWith("```json")) {
      text = text.slice(7);
    } else if (text.startsWith("```")) {
      text = text.slice(3);
    }
    if (text.endsWith("```")) {
      text = text.slice(0, -3);
    }
    text = text.trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }

    const parsed = JSON.parse(text);

    if (
      typeof parsed.score !== "number" ||
      typeof parsed.tier !== "string" ||
      typeof parsed.justification !== "string" ||
      !Array.isArray(parsed.strengths) ||
      !Array.isArray(parsed.improvements)
    ) {
      throw new Error(
        `Invalid score response structure. Raw: ${JSON.stringify(parsed)}`
      );
    }

    return parsed;
  } catch (error) {
    console.error("Scorer error:", error.message);
    return { ...DEFAULT_SCORE };
  }
}

module.exports = { scoreWallet };
