// mockServer.js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const mockReplies = {
  en: {
    crop: "Crop insurance helps farmers get financial protection against losses due to natural calamities, pests, or diseases.",
    job: "You can find local job updates on government portals like NREGA or nearby panchayat offices.",
    scheme: "Popular government schemes include PM-KISAN, PMFBY (crop insurance), and KCC (Kisan Credit Card).",
    default: "I'm here to help! Try asking about government schemes, jobs, or crop insurance."
  },
  ta: {
    crop: "பயிர் காப்பீடு விவசாயிகளுக்கு இயற்கை பேரழிவுகள் அல்லது நோய்களால் ஏற்படும் இழப்புகளை ஈடுசெய்ய உதவுகிறது.",
    job: "உள்ளூர் வேலை வாய்ப்புகளை நெருங்கிய பஞ்சாயத்து அலுவலகம் அல்லது அரசு இணையதளங்களில் பார்க்கலாம்.",
    scheme: "அரசு திட்டங்களில் முக்கியமானவை: பிரதம மந்திரி கிசான், பயிர் காப்பீடு திட்டம் (PMFBY), மற்றும் கிசான் கடன் அட்டை (KCC).",
    default: "நான் உதவ தயாராக இருக்கிறேன்! அரசு திட்டங்கள், வேலைகள் அல்லது பயிர் காப்பீடு பற்றி கேளுங்கள்."
  }
};

app.post("/api/chat", (req, res) => {
  const { message, lang } = req.body;
  const l = lang || "en";
  const msg = message.toLowerCase();

  let reply = mockReplies[l].default;

  if (msg.includes("crop")) reply = mockReplies[l].crop;
  else if (msg.includes("job")) reply = mockReplies[l].job;
  else if (msg.includes("scheme")) reply = mockReplies[l].scheme;

  // small delay to mimic typing
  setTimeout(() => res.json({ reply }), 800);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Mock AI server running on http://localhost:${PORT}`));
