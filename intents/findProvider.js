let { createTextMessage } = require('../libs/bots');
let { getActiveProviders } = require('../libs/data');



let filterProviders = (parameters, providers) => {
  let { provider, provider_type, Quality, Location, brandname} = parameters;
  let state_us = parameters['geo-state-us'];
  let city_us = parameters['geo-city'];

  let filteredProviders = providers.filter((providerObj) => {
    
  });
  
  return filteredProviders;
}

let findProvider = async ({ res, parameters }) => {
  let activeProviders = await getActiveProviders();
  let filteredProviders = filterProviders(parameters, activeProviders);
  res.send(filteredProviders);

  // let textMsg = createTextMessage('Testing');
  // let messages = [textMsg];
  // res.send({ messages });
}

module.exports = findProvider;