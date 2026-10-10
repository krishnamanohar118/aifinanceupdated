import { GoogleGenAI } from "@google/genai";
import ChatMessage from "../models/ChatMessage.js";
import { financeSummary, monthlySeries } from "./financeService.js";

const context = async (id) => {
  const s = await financeSummary(id);
  const m = await monthlySeries(id, 2);

  return `Current financial data:
Income: ₹${s.income}
Expenses: ₹${s.expenses}
Balance: ₹${s.balance}
Savings rate: ${s.savingsPercentage}%
Top spending category: ${
    s.topCategory
      ? `${s.topCategory.category} - ₹${s.topCategory.amount}`
      : "No expenses recorded"
  }
Monthly history: ${JSON.stringify(m)}`;
};

export async function reply(userId, message) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  try {
    // Get recent conversation history
    const history = await ChatMessage.find({
      userId,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Reverse so oldest message comes first
    history.reverse();

    // Get current financial information
    const facts = await context(userId);

    const ai = new GoogleGenAI({
      apiKey,
    });

    // Convert database history to Gemini conversation format
    const conversation = history.map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [
        {
          text: item.message,
        },
      ],
    }));

    // Add current question
    conversation.push({
      role: "user",
      parts: [
        {
          text: message,
        },
      ],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: conversation,
      config: {
        temperature: 0.4,
        maxOutputTokens: 500,
      },
    });

    return response.text || "I could not generate a response.";
  } catch (error) {
    console.error("Gemini assistant error:", error);
    throw error;
  }
}