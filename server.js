
const express = require("express");
const app = express();

app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("FLOW AI STUDIO Backend is Running!");
});

app.get("/health", (req, res) => {
  res.json({
    status: "online",
    app: "FLOW AI STUDIO"
  });
});

app.post("/generate", async (req, res) => {
  try {
    const { prompt, mode } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Video prompt is required"
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is missing"
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/interactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          model: "gemini-omni-1.2-flash",
          input: [
            {
              type: "text",
              text: prompt
            }
          ],
          response_format: {
            type: "video",
            duration: "6s",
            resolution: "720p",
            aspect_ratio: "9:16"
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: data.error?.message || "Video generation failed"
      });
    }

    let video = null;

    for (const step of (data.steps || [])) {
      if (step.type === "model_output") {
        video = (step.content || []).find(
          item => item.type === "video"
        );

        if (video) break;
      }
    }

    if (!video || !video.data) {
      return res.status(500).json({
        success: false,
        message: "Video data was not returned"
      });
    }

    res.json({
      success: true,
      status: "completed",
      message: "Video generated successfully!",
      mimeType: video.mime_type || "video/mp4",
      videoBase64: video.data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("FLOW AI STUDIO Server Started");
});
