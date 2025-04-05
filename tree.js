// [Previous content remains unchanged]

import { bot, db } from "./shared.js";
import { updateScore } from "./firebaseScoringEngine.js";

bot.onText(/\/refer/, async (msg) => {
  const chatId = msg.chat.id;
  const referralCode = `ref-${chatId}`;
  const referralLink = `https://t.me/${process.env.BOT_USERNAME}?start=${referralCode}`;

  await bot.sendMessage(chatId,
    `🔗 *Your EcoCoin Referral Link:*
${referralLink}

👥 Share this link. You get +3 score per valid referral.`,
    { parse_mode: "Markdown" });
});

bot.onText(/\/claim/, async (msg) => {
  const chatId = msg.chat.id;
  const uid = chatId.toString();
  const ref = db.collection("bonus_claims").doc(uid);
  const doc = await ref.get();
  const now = Date.now();
  const claimedToday = doc.exists && now - doc.data().timestamp < 24 * 60 * 60 * 1000;

  if (claimedToday) {
    return bot.sendMessage(chatId, "📆 You've already claimed your daily bonus. Come back tomorrow!");
  }

  await ref.set({ timestamp: now });
  await updateScore(uid, 1);
  bot.sendMessage(chatId, "🎁 Bonus claimed! +1 score added for green reading or action today.");
});

bot.onText(/\/help/, async (msg) => {
  const helpText = `🆘 *EcoCoin Bot Commands:*
/start - Begin or resume today's climate quiz
/score - View your total score
/tasks - View bonus tasks for extra score
/claim - Claim a daily bonus for green activity
/refer - Get your referral link
/help - Show this help message
/submit_tree - Report trees for EcoCoin rewards`;

  bot.sendMessage(msg.chat.id, helpText, { parse_mode: "Markdown" });
});

bot.onText(/\/submit_tree/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, `🌳 Please enter your tree data in the format:

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
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text && text.startsWith("Location:")) {
    try {
      const uid = chatId.toString();
      const treeRef = db.collection("tree_submissions").doc(uid);
      await treeRef.set({
        data: text,
        timestamp: Date.now(),
      });
      await updateScore(uid, 3); // preliminary score
      await bot.sendMessage(chatId, `✅ Tree data received!

Our team will review and verify your submission. You'll earn ECO coins once validated.`);
    } catch (err) {
      console.error("Error saving tree data:", err);
      await bot.sendMessage(chatId, "❌ Failed to save tree data. Please try again later.");
    }
  }
});
