let { createTextMessage, createGallery } = require('../libs/bots');
let { getActiveProviders } = require('../libs/data');

let byZipCode = (zip_code) => (provider) => {
  if (!zip_code) return true;
  return provider['postal'].includes(zip_code);
}

let byState = (state) => (provider) => {
  if (!state) return true;
  return provider['state'].includes(state.toLowerCase());
}

let byCity = (city) => (provider) => {
  if (!city) return true;
  return provider['city'].includes(city.toLowerCase());
}

let filterProviders = (parameters, providers) => {
  let { provider, provider_type, state, city, zip_code, quality, location, brand_name} = parameters;

  let filteredProviders = providers
    .filter(byZipCode(zip_code))
    .filter(byState(state))
    .filter(byCity(city));
    // .filter(byQuality(quality)
  
  return filteredProviders;
}

let findProvider = async ({ res, parameters, user }) => {
  let activeProviders = await getActiveProviders();
  let foundProviders = filterProviders(parameters, activeProviders);

  if (!foundProviders[0]) {
    let redirect_to_blocks = ['NLP - No Providers Found'];
    res.send({ redirect_to_blocks });
    return;
  }
  
  let txtMsg = createTextMessage();
  
  res.send(foundProviders);

  // let textMsg = createTextMessage('Testing');
  // let messages = [textMsg];
  // res.send({ messages });
}

module.exports = findProvider;