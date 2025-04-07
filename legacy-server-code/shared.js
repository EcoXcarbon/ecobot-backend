// shared.js
import admin from "firebase-admin";
import fs from "fs";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();

const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccount.json"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });
}

const db = admin.firestore();
const bot = new TelegramBot(process.env.BOT_TOKEN);
const userStates = new Map();

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  const welcomeMessage = `👋 *Welcome to EcoCoin!*

EcoCoin is a green cryptocurrency that rewards your climate knowledge and real-world environmental contributions.

Please choose an action:`;

  const options = {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🧠 Start Quiz", callback_data: "start_quiz" },
          { text: "📤 Submit Data", callback_data: "submit_carbon" }
        ]
      ]
    }
  };

  await bot.sendMessage(chatId, welcomeMessage, options);
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;

  if (query.data === "start_quiz") {
    bot.emit("start_quiz", { chat: { id: chatId } });
    return;
  }

  if (query.data === "submit_carbon") {
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🌳 Trees", callback_data: "submit_tree" },
            { text: "🚗 EV", callback_data: "submit_ev" },
            { text: "☀️ Solar", callback_data: "submit_solar" }
          ]
        ]
      }
    };
    await bot.sendMessage(chatId, "📊 Choose the type of carbon-offset asset you'd like to register:", opts);
  }

  if (query.data === "submit_tree") {
    userStates.set(chatId, { treeSubmission: true });
    return bot.sendMessage(chatId, `🌳 Please enter your tree data in the format:

*Location:* (e.g. Swabi, KP)
*Number of trees:* (e.g. 50)
*Type:* (e.g. Poplar)
*Age:* (e.g. 2 years)
*Ownership:* (e.g. Community / Personal)

_Example:_
Location: Swabi, KP
Number: 50
Type: Poplar
Age: 2 years
Ownership: Community`, { parse_mode: "Markdown" });
  }

  if (query.data === "submit_ev") {
    return bot.sendMessage(chatId, `🚗 Please enter your EV data:

*Model:* (e.g. Tesla Model 3)
*Year:* (e.g. 2022)
*Registration:* (e.g. ABC-1234)
*Chassis No:* (optional)
*Odometer Reading:* (e.g. 13500 km)

_We will apply verified CO₂ offset rates for validation._`, { parse_mode: "Markdown" });
  }

  if (query.data === "submit_solar") {
    return bot.sendMessage(chatId, `☀️ Please enter your solar system data:

*Location:* (e.g. Peshawar, KP)
*Installed Capacity:* (e.g. 5 kW)
*Installation Year:* (e.g. 2021)

_Your solar contribution will be validated using standard benchmarks._`, { parse_mode: "Markdown" });
  }
});

export { bot, db, userStates };
