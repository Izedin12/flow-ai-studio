const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("FLOW AI STUDIO Backend is Running!");
});

app.get("/health", (req, res) => {
  res.json({
    status: "online",
    app: "FLOW AI STUDIO"
  });
});

const PORT = process.env.PORT || 3000;
app.post("/generate", (req, res) => {
  const { prompt, mode } = req.body;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({
      success: false,
      message: "Video prompt is required"
    });
  }

  res.json({
    success: false,
    status: "ready",
    app: "FLOW AI STUDIO",
    mode: mode || "text-to-video",
    prompt: prompt,
    message: "Backend received your prompt. AI video engine is not connected yet."
  });
});
app.listen(PORT, () => {
  console.log("FLOW AI STUDIO Server Started");
});
