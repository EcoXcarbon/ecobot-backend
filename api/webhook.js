// api/webhook.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { message } = req.body;
console.log("📩 Received Telegram message:", message);

  if (!message || !message.text) {
    return res.status(200).send("No message");
  }

  const chatId = message.chat.id;
  const userText = message.text;

  let reply = `You said: ${userText}`;
  if (userText === "/start") {
    reply = `👋 Welcome back, Yasir!\n🚀 Tap below to launch the EcoCoin App:\n\n🌿 [Open EcoCoin App](https://ecocoin.vercel.app)`;
  }

  await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: reply,
      parse_mode: "Markdown",
    }),
  });

  res.status(200).send("OK");
}
