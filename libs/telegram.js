let { TELEGRAM_BOT_API_KEY } = process.env;

let TeleBot = require('telebot');

let bot = new TeleBot({
  token: TELEGRAM_BOT_API_KEY,
  usePlugins: ['askUser']
});

let user_ids = ['320152621'];

bot.on('/start', (msg) => {
  return msg.reply.text(
    `Please Give Edwin Your User ID: ${msg.from.id}`
  );
});

bot.start();

// Exposed Functions
let sendErrorMsg = async (error_msg) => {
  for (let user_id of user_ids) {
    let msg = await bot.sendMessage(user_id, error_msg);
  }
}

module.exports = {
  sendErrorMsg,
}