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

function getDynamicFallback(collectedData) {
  const improvements = [];
  const strengths = [];
  const github = collectedData.github || {};
  const onchain = collectedData.onchain || {};
  const defi = collectedData.defi || {};

  const githubUser = collectedData.githubUsername || github.githubUsername;

  if (githubUser) strengths.push("Verified Developer Identity");
  if ((github.totalRepos || 0) > 20) strengths.push("Prolific Open Source Contributor");
  else if ((github.totalRepos || 0) > 5) strengths.push("Active GitHub Developer");
  if ((github.totalStars || 0) > 10) strengths.push("Community Recognized Repos");
  if ((onchain.totalTxCount || 0) > 0) strengths.push("Onchain History Authenticated");
  if ((onchain.contractsDeployed || 0) > 0) strengths.push("Smart Contract Deployer");

  if (!githubUser) improvements.push("Link a GitHub account to prove development work");
  else if ((github.totalCommits || 0) < 10) improvements.push("Increase your contribution frequency on GitHub");

  if ((onchain.totalTxCount || 0) < 5) improvements.push("Perform more onchain transactions on Etherlink");
  if ((onchain.contractsDeployed || 0) === 0) improvements.push("Deploy a smart contract to demonstrate builder activity");
  if ((defi.swapCount || 0) === 0) improvements.push("Interact with DeFi protocols on Etherlink");

  while (improvements.length < 3) {
    improvements.push("Explore and interact with more decentralised applications");
    if (improvements.length >= 3) break;
  }

  let rawScore = 0;
  rawScore += Math.min(30, (onchain.contractsDeployed || 0) * 15);
  rawScore += Math.min(15, (onchain.uniqueProtocols || 0) * 3);
  rawScore += Math.min(15, (onchain.totalTxCount || 0) > 0 ? Math.floor(Math.log10(onchain.totalTxCount) * 5) : 0);
  rawScore += Math.min(10, (github.totalRepos || 0));
  rawScore += Math.min(15, (github.totalCommits || 0) > 0 ? Math.floor(Math.log10(github.totalCommits) * 5) : 0);
  rawScore += Math.min(5, Math.floor((github.totalStars || 0) * 0.5));
  rawScore += github.hasOpenSourceContribs ? 5 : 0;
  rawScore += Math.min(5, Math.floor((defi.defiScore || 0) / 2));

  const hasOnchain = (onchain.totalTxCount || 0) > 0;
  const score = hasOnchain ? Math.min(100, rawScore) : Math.min(20, Math.max(rawScore > 0 ? 5 : 0, rawScore));

  let tier = "Newcomer";
  if (score > 70) tier = "Core Dev";
  else if (score > 45) tier = "Contributor";
  else if (score > 20) tier = "Builder";

  return {
    score,
    tier,
    justification: "Scoring fallback — AI analysis briefly unavailable, showing data-driven recommendations.",
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
  };
}

function parseGeminiResponse(text) {
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
}

async function callGemini(genAI, modelName, contents, generationConfig) {
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent({ contents, generationConfig });

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

  return parseGeminiResponse(text);
}

async function scoreWallet(collectedData) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY not set in environment");
      return getDynamicFallback(collectedData);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const prompt = buildScoringPrompt(collectedData);
    const generationConfig = { temperature: 0.2, maxOutputTokens: 2048 };
    const contents = [{ role: "user", parts: [{ text: prompt }] }];

    const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash"];

    for (const modelName of modelsToTry) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          if (attempt > 0) {
            const delay = 16000 * attempt;
            console.log(`Retry ${attempt} for ${modelName} in ${delay / 1000}s...`);
            await new Promise((r) => setTimeout(r, delay));
          }

          console.log(`Trying model: ${modelName} (attempt ${attempt + 1})...`);
          const parsed = await callGemini(genAI, modelName, contents, generationConfig);
          return parsed;
        } catch (err) {
          const is429 = err.message && err.message.includes("429");
          console.error(`${modelName} attempt ${attempt + 1} failed: ${err.message.slice(0, 120)}`);
          if (!is429) break;
        }
      }
    }

    console.error("All Gemini models exhausted, using dynamic fallback");
    return getDynamicFallback(collectedData);
  } catch (error) {
    console.error("Scorer error:", error.message);
    return getDynamicFallback(collectedData);
  }
}

module.exports = { scoreWallet };
