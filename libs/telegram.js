let { TELEGRAM_BOT_API_KEY } = process.env;

let TeleBot = require('telebot');
let bot = new TeleBot(TELEGRAM_BOT_API_KEY);

bot.start();

bot.on('bot-error', (msg) => {
  console.log(arguments);
  return msg.reply.text(
    `Testing`
  );
});

let sendErrorMsg = () => {
  bot.event(
    'bot-error',
    { x: 1 }
  );
}

module.exports = {
  sendErrorMsg,
}