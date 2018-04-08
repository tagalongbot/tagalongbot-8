let { DATABASE_API_TOKEN } = process.env;
let fetch = require('node-fetch');

let createOptions = (endpoint) => {
  let method = 'GET';
  let url = `http://api.bevlbeauty.com/api/Edwin${endpoint}`;
  let qs = { token: DATABASE_API_TOKEN };
  let options = { method, url, qs };
  return options;
}

let handleData = (error, response, body) => {
  
}

let getActiveProviders = () => {
  let options = createOptions('/GetProviders');
  fetch(options, handleData);
}

let getServices = () => {}
let getProviderServices = () => {}
let getActivePromos = () => {}

module.exports = {};