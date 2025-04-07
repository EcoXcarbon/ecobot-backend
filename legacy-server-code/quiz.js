import { bot } from "./shared.js";
import { questions, getRandomQuestion } from "./questions.js";
import { updateScore } from "./firebaseScoringEngine.js";

const MAX_QUESTIONS = 5;
let userSessions = {};
let userLastPlay = {};

function formatQuestion(q) {
  return {
    text: `🌍 *Climate Quiz Time!*\n\n*${q.question}*`,
    options: {
      parse_mode: "Markdown",
      reply_markup: {
        keyboard: q.options.map(opt => [opt]),
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    },
  };
}

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;

  if (query.data === "start_quiz") {
    const now = Date.now();
    const lastPlayed = userLastPlay[chatId] || 0;
    const hoursSince = (now - lastPlayed) / (1000 * 60 * 60);

    if (userSessions[chatId]) {
      await bot.sendMessage(chatId, "♻️ Resuming your existing quiz session...");
      const q = getRandomQuestion(userSessions[chatId].asked);
      userSessions[chatId].asked.push(q.question);
      const { text, options } = formatQuestion(q);
      return bot.sendMessage(chatId, text, options);
    }

    if (hoursSince < 24) {
      return bot.sendMessage(chatId, "🌱 You've already completed today's quiz. Come back tomorrow!");
    }

    userSessions[chatId] = {
      currentQ: 0,
      correct: 0,
      asked: [],
    };
    userLastPlay[chatId] = now;

    await bot.sendMessage(chatId,
      `👋 *Welcome to the EcoCoin Climate Quiz!*\n\n` +
      `EcoCoin is a green cryptocurrency that rewards knowledge + action.\n\n` +
      `🎯 You will now face *5 climate questions*.\n` +
      `✅ Answer to boost your score.\n` +
      `💲 Your ECO reward is based on your relative performance.\n\n` +
      `Use /score to check your total score.\n` +
      `Use /tasks to explore bonus actions.\n\n` +
      `Let’s go! 🌿`,
      { parse_mode: "Markdown" }
    );

    const q = getRandomQuestion();
    userSessions[chatId].asked.push(q.question);
    const { text, options } = formatQuestion(q);
    bot.sendMessage(chatId, text, options);
  }
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const session = userSessions[chatId];

  if (!session || session.currentQ >= MAX_QUESTIONS) return;

  const lastQ = questions.find(q => q.question === session.asked[session.asked.length - 1]);
  if (!lastQ) return;

  if (text === lastQ.answer) {
    session.correct++;
    await updateScore(chatId.toString(), 1);
    await bot.sendMessage(chatId, "✅ Correct!");
  } else {
    await bot.sendMessage(chatId, `❌ Incorrect. The correct answer was *${lastQ.answer}*`, { parse_mode: "Markdown" });
  }

  session.currentQ++;

  if (session.currentQ >= MAX_QUESTIONS) {
    await bot.sendMessage(chatId,
      `🎉 *Quiz Complete!*\n\n` +
      `✅ You answered *${session.correct}/${MAX_QUESTIONS}* correctly.\n` +
      `🎏 Your score has been logged.\n\n` +
      `🌒 ECO reward will be assigned based on your relative rank.\n\n` +
      `Use /tasks for bonus earning options.\n` +
      `Come back tomorrow for a new quiz! 🌱`,
      { parse_mode: "Markdown" }
    );
    delete userSessions[chatId];
  } else {
    const nextQ = getRandomQuestion(session.asked);
    session.asked.push(nextQ.question);
    const { text, options } = formatQuestion(nextQ);
    bot.sendMessage(chatId, text, options);
  }
});
