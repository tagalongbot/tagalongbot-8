let { DATABASE_API_TOKEN } = process.env;
let fetch = require('node-fetch');

let toJSON = (res) => res.json();

let createFetchData = (endpoint) => {
  let method = 'GET';
  let url = `http://api.bevlbeauty.com/api/Edwin${endpoint}?token=${DATABASE_API_TOKEN}`;
  let body = {};
  let options = { method };
  return { url, options };
}

let createEndpoint = (endpoint) => async () => {
  let { url, options } = createFetchData(endpoint);
  let data = await fetch(url, options).then(toJSON);
  return data;
}

let getActiveProviders = createEndpoint('/GetProviders');
let getServices = createEndpoint('/GetServices');
let getProviderServices = createEndpoint('/GetProviderServices');
let getActivePromos = createEndpoint('/GetPromos');

module.exports = {
  getActiveProviders,
  getServices,
  getProviderServices,
  getActivePromos,
};