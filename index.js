const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(bodyParser.json());

// ✅ REQUIRED: Meta webhook verification GET endpoint
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "kartklicksbot123";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WEBHOOK VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403); // Forbidden
  }
});

// ✅ Handle incoming WhatsApp messages (POST)
app.post("/webhook", (req, res) => {
  console.log("📥 Incoming message:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// ✅ Health check
app.get("/", (req, res) => {
  res.send("KartKlicks Bot Webhook is running.");
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
