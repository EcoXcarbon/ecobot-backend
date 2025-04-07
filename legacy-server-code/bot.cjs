require("dotenv").config();
const { Telegraf } = require("telegraf");
const database = require("./database");
const questions = require("./questions");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  const userId = ctx.from.id.toString();
  await database.initUser(userId);
  await ctx.reply(`🌿 Welcome to EcoCoin, ${ctx.from.first_name}! Let's start your climate quiz journey.`);
  sendQuestion(ctx, userId);
});

bot.command("quiz", async (ctx) => {
  const userId = ctx.from.id.toString();
  sendQuestion(ctx, userId);
});

async function sendQuestion(ctx, userId) {
  const currentIndex = await database.getCurrentQuestion(userId);
  const q = questions[currentIndex];

  const keyboard = {
    reply_markup: {
      inline_keyboard: q.options.map((opt, index) => [
        {
          text: opt,
          callback_data: `answer_${currentIndex}_${index}`,
        },
      ]),
    },
  };

  ctx.reply(q.text, keyboard);
}

bot.on("callback_query", async (ctx) => {
  const data = ctx.callbackQuery.data;
  const userId = ctx.from.id.toString();

  if (data.startsWith("answer_")) {
    const [, qIndex, aIndex] = data.split("_").map(Number);
    const correct = questions[qIndex].answerIndex === aIndex;

    if (correct) {
      await database.incrementScore(userId);
      await ctx.reply("✅ Correct! You earned 🌱 Eco Points.");
    } else {
      await ctx.reply("❌ Incorrect. Try again tomorrow!");
    }

    await database.advanceQuestion(userId);
  }

  ctx.answerCbQuery();
});

bot.launch();
console.log("🚀 EcoCoin Telegram Bot is running...");
