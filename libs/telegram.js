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

bot.on('/test1', (msg) => {
   let replyMarkup = bot.keyboard([
        ['/buttons', '/test1'],
        ['/start', '/hide']
    ], {resize: true});

    return bot.sendMessage(msg.from.id, 'Keyboard example.', {replyMarkup});
});

bot.on('/buttons', msg => {
    let replyMarkup = bot.keyboard([
        [bot.button('/test1', 'Your contact'), bot.button('location', 'Your location')],
        ['/back', '/hide']
    ], {resize: true});

    return bot.sendMessage(msg.from.id, 'Button example.', {replyMarkup});

});

// Exposed Functions
let sendErrorMsg = async (error_msg) => {
  for (let user_id of user_ids) {
    let msg = await bot.sendMessage(user_id, error_msg);
  }
}

module.exports = {
  sendErrorMsg,
}