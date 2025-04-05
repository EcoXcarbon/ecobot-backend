export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  // Verify BOT_TOKEN exists
  if (!process.env.BOT_TOKEN) {
    console.error("❌ BOT_TOKEN is not set in environment variables");
    return res.status(500).send("Server configuration error");
  }

  const { message } = req.body;

  if (!message || !message.text) {
    console.log("⚠️ No text in message or message is undefined.");
    return res.status(200).send("No message");
  }

  const chatId = message.chat.id;
  const userText = message.text;

  console.log("📩 Message received:", userText);
  console.log("👤 chat ID:", chatId);

  let reply;
  
  if (userText === "/start") {
    reply = [
      "👋 \\*Welcome back, Yasir\\!\\*",
      "",
      "🚀 Tap below to launch the EcoCoin App\\:",
      "",
      "🌿 [Open EcoCoin App](https://ecocoin\\.vercel\\.app)"
    ].join("\n");
  } else {
    reply = `You said: ${userText.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&")}`;
  }

  try {
    const telegramRes = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: reply,
          parse_mode: "MarkdownV2",
          disable_web_page_preview: true,
        }),
      }
    );

    const data = await telegramRes.json();
    console.log("📬 Telegram API response:", data);

    if (!data.ok) {
      console.error("❌ Telegram API error:", data.description || data);
      return res.status(400).json({
        error: "Telegram API error",
        details: data.description || data
      });
    }

    res.status(200).send("Message processed");
  } catch (error) {
    console.error("❌ Network/Server error:", error.message);
    res.status(500).json({
      error: "Failed to send message",
      details: error.message
    });
  }
}