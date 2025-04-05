// api/telegram.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { message } = req.body;

  if (!message || !message.text) {
    console.log("⚠️ No text in message");
    return res.status(200).send("No message");
  }

  const chatId = message.chat.id;
  const userText = message.text;
  const reply = `Echo: ${userText}`;

  console.log("📩 Message received:", userText);

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply
      }),
    });

    const result = await tgRes.json();
    console.log("📤 Telegram API response:", result);

    res.status(200).send("OK");
  } catch (err) {
    console.error("❌ Telegram error:", err);
    res.status(500).send("Telegram send failed");
  }
}
