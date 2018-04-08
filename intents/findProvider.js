let { createTextMessage } = require('../libs/bots');
let { getActiveProviders } = require('../libs/data');

let filterProviders


let findProvider = async ({ res, parameters }) => {
  let activeProviders = await getActiveProviders();
  let filteredProviders = activeProviders.filter(byParameters);
  
  
  res.send(activeProviders);
  
  // let textMsg = createTextMessage('Testing');
  // let messages = [textMsg];
  // res.send({ messages });
}

module.exports = findProvider;