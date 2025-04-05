export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { message } = req.body;
  if (!message || !message.text) {
    console.log("⚠️ No message received");
    return res.status(200).send("No message");
  }

  const chatId = message.chat.id;
  const userText = message.text;
  console.log("📩 Incoming:", userText);

  const escapeMarkdownV2 = (text) =>
    text.replace(/([_*\[\]()~`>#+=|{}.!\\-])/g, "\\$1");

  let reply = `You said: ${escapeMarkdownV2(userText)}`;

  if (userText === "/start") {
    reply =
      "👋 *Welcome back, Yasir\\!*\\n\\n🚀 Tap below to launch the EcoCoin App:\\n\\n🌿 [Open EcoCoin App](https://ecocoin\\.vercel\\.app)";
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: reply,
          parse_mode: "MarkdownV2",
          disable_web_page_preview: true,
        }),
      }
    );

    const data = await response.json();
    console.log("📬 Telegram response:", data);
    res.status(200).send("Message processed");
  } catch (err) {
    console.error("❌ Telegram send error:", err.message);
    res.status(500).send("Failed");
  }
}
