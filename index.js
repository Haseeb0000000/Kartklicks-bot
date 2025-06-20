require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// ✅ Distance calculator using Google Maps API
async function getDistanceInKm(pickup, drop) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(pickup)}&destinations=${encodeURIComponent(drop)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const distanceText = response.data.rows[0].elements[0].distance.text; // e.g. "3.2 km"
    const distanceKm = parseFloat(distanceText);
    return distanceKm;
  } catch (error) {
    console.error("❌ Error getting distance:", error.message);
    return 0;
  }
}

// ✅ Meta Webhook Verification
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "kartklicksbot123";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WEBHOOK VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ Handle WhatsApp Messages
app.post("/webhook", async (req, res) => {
  const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  const from = message?.from; // WhatsApp number

  if (message?.text?.body?.toLowerCase().includes("done123")) {
    const pickup = "Lal Chowk, Srinagar";
    const drop = "Rajbagh, Srinagar";

    const distance = await getDistanceInKm(pickup, drop);
    const rate = 10;
    const price = Math.ceil(distance * rate);

    console.log(`📏 Distance: ${distance} km`);
    console.log(`💰 Price: ₹${price}`);

    // ✅ Send WhatsApp Template Message
    const phoneNumberId = 730788316774469; // 🔁 Replace this
    const accessToken = EAAOctm9n94MBO5ZAD3NTFzFMcOZBMeDg2qDZAaZCLrcwscxqgynZCC9mGJUJvZBKm0LPGWQGOJPl7GUmda5PFBNrjkxIOiU2CI6ZCV4tPRZCEsHQ50ZAZC028cR6ywYBZC2iyiF2tEoL3Ls8BI8ATqDnLHoBuOBqusIfMA9kscH1dP0shwcouPm2r5UQjuAfjeYjT0Q17SBk8HBBCvLpjhgXbka3ZBdOBtahRkHXNhrlWAoDnpIFfY8ZD; // 🔁 Replace this

    const data = {
      messaging_product: "whatsapp",
      to: from,
      type: "template",
      template: {
        name: "order_confirmation", // 🔁 Use your actual template name
        language: { code: "en_US" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: "Mustaqeez" },
              { type: "text", text: `Kurta pickup from Lal Chowk to Rajbagh\nAmount: ₹${price}` }
            ]
          }
        ]
      }
    };

    await axios.post(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );
  }

  res.sendStatus(200);
});

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("KartKlicks Bot Webhook is running.");
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
