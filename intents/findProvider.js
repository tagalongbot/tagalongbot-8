let { createTextMessage } = require('../libs/bots');
let { getActiveProviders } = require('../libs/data');

let byZipCode = (zip_code) => (provider) => {
  console.log('Zip Code', zip_code);
  return provider['postal'].includes(zip_code);
}

let filterProviders = (parameters, providers) => {
  let { provider, provider_type, state, city, zip_code, quality, location, brand_name} = parameters;

  let filteredProviders = providers
    .filter(byZipCode(zip_code));
  
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