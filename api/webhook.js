import { Telegraf } from 'telegraf';
import { buffer } from 'micro';

const bot = new Telegraf(process.env.BOT_TOKEN);

// Example command handler
bot.start((ctx) => {
  ctx.reply(`Welcome to EcoCoin, ${ctx.from.first_name}! 🌿`);
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const rawBody = await buffer(req);
    const update = JSON.parse(rawBody.toString('utf8'));

    await bot.handleUpdate(update);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Tell Vercel not to parse body automatically
export const config = {
  api: {
    bodyParser: false,
  },
};
