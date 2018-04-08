let { createTextMessage } = require('../libs/bots');

let findProvider = ({ res, parameters }) => {
  let textMsg = createTextMessage('Testing');
  let messages = [textMsg];
  res.send({ messages });
}

module.exports = findProvider;