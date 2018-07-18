let { TELEGRAM_BOT_API_KEY } = process.env;

let TeleBot = require('telebot');
let bot = new TeleBot(TELEGRAM_BOT_API_KEY);

// bot.start();

bot.on('bot-error', (msg) => {
  return bot.sendMessage(
    msg.from.id,
    ``
  );
});