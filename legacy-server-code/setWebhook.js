// setWebhook.js
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.BOT_TOKEN;
const webhookUrl = `${process.env.WEBHOOK_URL}/telegram`;

const bot = new TelegramBot(token, { webHook: true });

bot.setWebHook(webhookUrl)
  .then(() => {
    console.log("✅ Webhook set successfully:", webhookUrl);
  })
  .catch((err) => {
    console.error("❌ Failed to set webhook:", err);
  });
