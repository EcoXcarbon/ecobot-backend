// setWebhookNode.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const botToken = process.env.BOT_TOKEN;
const webhookUrl = process.env.WEBHOOK_URL;

const setWebhook = async () => {
  const url = `https://api.telegram.org/bot${botToken}/setWebhook`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl }),
    });

    const data = await response.json();
    if (data.ok) {
      console.log("✅ Webhook set successfully:", data);
    } else {
      console.error("❌ Failed to set webhook:", data);
    }
  } catch (err) {
    console.error("❌ Request error:", err.message);
  }
};

setWebhook();
