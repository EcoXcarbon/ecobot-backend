// api/telegram.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { message } = req.body;

  if (!message || !message.text) {
    console.log("⚠️ No text in message or message is undefined.");
    return res.status(200).send("No message");
  }

  const chatId = message.chat.id;
  const userText = message.text;

  console.log("📩 Message received:", userText);

  let reply = `You said: ${userText}`;

  if (userText === "/start") {
    reply = `👋 Welcome back, Yasir!\n🚀 Tap below to launch the EcoCoin App:\n\n🌿 Open EcoCoin App: https://ecocoin.vercel.app`;
  }

  try {
    const telegramRes = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply,
        parse_mode: "Markdown"
      }),
    });

    const result = await telegramRes.json();

    if (!result.ok) {
      console.error("❌ Failed to send message to Telegram:", result);
    } else {
      console.log("✅ Telegram response sent:", result);
    }
  } catch (err) {
    console.error("🚨 Error sending message to Telegram:", err);
  }

  res.status(200).send("Message processed");
}
