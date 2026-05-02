// server.js
import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 Your Gemini API key (keep secret)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// 🔹 Helper: Mock AI response (if Gemini fails)
function mockAIResponse(message) {
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes("scheme") || lowerMsg.includes("திட்டம்"))
    return "🌾 Government schemes help farmers and villagers. You can apply via the local e-Sevai center or the official TN Government website.";
  if (lowerMsg.includes("job") || lowerMsg.includes("வேலை"))
    return "💼 Local job updates are available at your district employment office or village portal notice board.";
  if (lowerMsg.includes("insurance") || lowerMsg.includes("காப்பீடு"))
    return "🌾 Crop insurance covers losses due to floods, droughts, and pests. Visit your nearby agriculture office to register.";
  return "🤖 I'm your offline assistant! Please ask about government schemes, local jobs, or crop insurance.";
}

// 🔹 Main Chat API (Gemini)
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `You are an AI assistant for farmers and individuals..dont use special characterss and everything should be human readable and easy to understand, dont use bold and * Provide accurate and simple info about Government Schemes, Local Job Updates, and Crop Insurance. Reply in the user's language (English or Tamil) based on input.\n\nUser message: ${message}` }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log(data)
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ I couldn't get a response right now.";
    res.json({ reply });
  } catch (error) {
    console.error("⚠️ Gemini API failed:", error.message);
    res.json({ reply: mockAIResponse(message) });
  }
});

app.listen(5000, () =>
  console.log("✅ Gemini server running at http://localhost:5000")
);
