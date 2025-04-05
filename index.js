import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import admin from "firebase-admin";
import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { bot } from "./shared.js";
import "./quiz.js";
import "./tree.js";

// Load env variables
dotenv.config();

// Firebase Admin SDK initialization
const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccount.json", "utf8"));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

// Telegram Bot setup (Webhook only)
const WEBHOOK_PATH = `/bot${process.env.BOT_TOKEN}`;
const WEBHOOK_URL = `https://ecocoin-f1.vercel.app${WEBHOOK_PATH}`;

// Web server to receive webhook
const app = express();
app.use(bodyParser.json());
app.post(WEBHOOK_PATH, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));

// Webhook registration
(async () => {
  try {
    await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/setWebhook`, {
      url: WEBHOOK_URL
    });
    console.log("✅ Webhook registered successfully.");
  } catch (err) {
    console.error("❌ Failed to register webhook:", err.message);
  }
})();
