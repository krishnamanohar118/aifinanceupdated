import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { question, goals = [], chatHistory = [] } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        message: "Gemini API key is missing",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    // Convert savings goals into readable text
    const goalsText =
      goals.length > 0
        ? goals
            .map(
              (goal) =>
                `- ${goal.name}: Target ₹${goal.targetAmount}, Current ₹${goal.currentAmount}, Progress ${goal.progress}%`
            )
            .join("\n")
        : "No savings goals available.";

    // Convert previous messages into chat context
    const historyText =
      chatHistory.length > 0
        ? chatHistory
            .map(
              (msg) =>
                `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
            )
            .join("\n")
        : "No previous conversation.";

    const prompt = `
You are a personal finance chatbot.

Your job is to have a natural, helpful, and relevant conversation with the user about:
- Savings
- Savings goals
- Budgeting
- Expenses
- Income
- Personal money management
- Financial planning
- Saving strategies

IMPORTANT RULES:

1. Answer only the user's actual question.
2. Do not provide unrelated information.
3. Keep your answer simple, clear, concise, and conversational.
4. If the user asks about their savings goals, use the provided goal data.
5. Never invent or assume the user's income, expenses, savings, targets, dates, or other financial information.
6. If required information is missing, clearly state what information is needed and ask the user for it.
7. Do not repeat the entire savings-goal list unless it is directly relevant to the user's question.
8. Use the previous conversation to understand follow-up questions and maintain context.
9. If the user asks a simple question, give a simple and direct answer.
10. If the user asks for a calculation, show the calculation clearly and provide the final result.
11. If the user asks something unrelated to personal finance, respond:
I can help with personal finance, savings, budgeting, and your savings goals. What would you like to know?
12. Do not make assumptions about the user's financial situation.
13. Do not claim that an action was performed unless it was actually performed.
14. Give practical financial guidance, but do not overwhelm the user with unnecessary explanations.
15. Do not provide information that was not requested unless it is necessary to answer the question.
16. If the user asks about a specific savings goal, focus only on that goal.

RESPONSE FORMAT RULES:

17. Use plain text only.
18. Do not use Markdown formatting.
19. Do not use ** for bold text.
20. Do not use * for italic text or bullet points.
21. Do not use # for headings.
22. Do not use backticks.
23. Do not use Markdown tables.
24. You may use simple numbered lists such as 1., 2., and 3.
25. Use normal paragraphs and line breaks.
26. Do not add unnecessary symbols, emojis, or decorative formatting.
27. Do not repeat the user's question unnecessarily.
28. Make the response easy to read in a chat interface.

USER'S SAVINGS GOALS:
${goalsText || "No savings goals available."}

PREVIOUS CONVERSATION:
${historyText || "No previous conversation."}

CURRENT USER QUESTION:
${question}

Now answer the user's current question naturally, directly, and concisely.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
        maxOutputTokens: 4000,
      },
    });

    const answer =
      response.text?.trim() ||
      "Sorry, I could not generate a response.";
    return res.json({
      answer,
    });
  } catch (error) {
    console.error("Gemini assistant error:", error);

    return res.status(500).json({
      message:
        error?.message || "Unable to connect to the finance assistant.",
    });
  }
});

export default router;