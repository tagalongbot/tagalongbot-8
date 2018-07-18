let { TELEGRAM_BOT_API_KEY } = process.env;

let TeleBot = require('telebot');
let bot = new TeleBot(TELEGRAM_BOT_API_KEY);

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
    console.log('msg', msg);
  }
}

let createAnswerList = () => {
 // Create a new answer list object
    const answers = bot.answerList(msg.id, {cacheTime: 60});

    // Article
    answers.addArticle({
        id: 'query',
        title: 'Inline Title',
        description: `Your query: ${ query }`,
        message_text: 'Click!'
    });

    // Photo
    answers.addPhoto({
        id: 'photo',
        caption: 'Telegram logo.',
        photo_url: 'https://telegram.org/img/t_logo.png',
        thumb_url: 'https://telegram.org/img/t_logo.png'
    });

    // Gif
    answers.addGif({
        id: 'gif',
        gif_url: 'https://telegram.org/img/tl_card_wecandoit.gif',
        thumb_url: 'https://telegram.org/img/tl_card_wecandoit.gif'
    });

    // Send answers
    return bot.answerQuery(answers);}

module.exports = {
  sendErrorMsg,
}