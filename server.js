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

app.listen(PORT, () => {
  console.log("FLOW AI STUDIO Server Started");
});
