
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Webhook verification for Meta
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "kartklicksbot123";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WEBHOOK_VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Message handler for POST requests
app.post("/webhook", (req, res) => {
  console.log("Received message:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("KartKlicks Bot Webhook is running.");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
