import getRandomQuestions from "../utils/questionSelector.js";
import questions from "../utils/quizQuestions.js";

const userSessions = {}; // Store active quiz sessions

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { message, callback_query } = req.body;

  if (callback_query) {
    const chatId = callback_query.message.chat.id;
    const data = callback_query.data;

    const session = userSessions[chatId];
    if (!session) {
      console.log("⚠️ No active session for this user");
      return res.status(200).send("No session");
    }

    const currentQ = session.questions[session.current];
    console.log("✅ Answer received:", data);

    if (data === currentQ.answer) session.score += 5;
    session.current++;

    if (session.current >= session.questions.length) {
      const reply = `✅ *Quiz Completed!*\n\n🎯 Your Score: *${session.score}*/25\n\n🚀 Submit your score in the EcoCoin App to claim rewards!`;
      delete userSessions[chatId];
      await sendMessage(chatId, reply, true);
    } else {
      await sendQuestion(chatId, session);
    }

    return res.status(200).send("Answer processed");
  }

  if (!message || !message.text) {
    console.log("⚠️ No valid message.text in request");
    return res.status(200).send("No message");
  }

  const chatId = message.chat.id;
  const userText = message.text;
  console.log("📥 Incoming Text:", userText);

  if (userText === "/start") {
    const reply = `👋 Welcome back, Yasir!\n\n🚀 Tap below to launch the EcoCoin App:\n\n🌿 [Open EcoCoin App](https://ecocoin-f1.vercel.app)`;
    await sendMessage(chatId, reply, true);
  } else if (userText === "/task") {
    console.log("🧠 Starting new quiz session...");
    const selectedQuestions = getRandomQuestions(5);
    console.log("📋 Questions selected:", selectedQuestions.map(q => q.question));

    userSessions[chatId] = {
      questions: selectedQuestions,
      current: 0,
      score: 0,
    };

    await sendQuestion(chatId, userSessions[chatId]);
  } else {
    await sendMessage(chatId, `You said: ${userText}`);
  }

  return res.status(200).send("Message processed");
}

async function sendMessage(chatId, text, markdown = false) {
  const body = {
    chat_id: chatId,
    text,
    parse_mode: markdown ? "Markdown" : undefined,
  };

  console.log("📤 Sending message:", text);

  await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function sendQuestion(chatId, session) {
  const q = session.questions[session.current];
  console.log(`📚 Sending question ${session.current + 1}:`, q.question);

  const buttons = q.options.map((opt) => [{ text: opt, callback_data: opt }]);

  const body = {
    chat_id: chatId,
    text: `❓ *Question ${session.current + 1}:*\n${q.question}`,
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: buttons },
  };

  await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
