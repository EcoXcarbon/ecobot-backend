import { Telegraf } from "telegraf";
import admin from "firebase-admin";
import dotenv from "dotenv";
import { onRequest } from "firebase-functions/v2/https";
import serviceAccount from "./serviceAccount.json" assert { type: "json" };

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const bot = new Telegraf(process.env.BOT_TOKEN);

// ✅ Handle /start
bot.start(async (ctx) => {
  const user = ctx.from;
  await db.collection("users").doc(user.id.toString()).set({
    id: user.id,
    username: user.username,
    first_name: user.first_name,
    joinedAt: new Date().toISOString(),
  });
  await ctx.reply(
    `👋 Welcome to EcoCoin, ${user.first_name}!\nYou’ve successfully joined the platform.\n\nTap the Menu or use buttons below to begin.`
  );
});

// Add more command handlers here if needed

// 🔁 Generic message handler (optional)
bot.on("text", async (ctx) => {
  await ctx.reply("Type /start to begin or choose an option from the menu.");
});

export default bot;
