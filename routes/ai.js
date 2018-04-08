let { API_AI_KEY } = process.env;
let API_AI = require('apiai');
let API_AI_APP = API_AI(API_AI_KEY);
let request = require('request');

let { randomize } = require('../libs/helpers');

let createTextMsg = (text) => {
  return { messages: [{ text }] };
}

let handleResponse = (response) => ({ result, sessionId }) => {
	let message;
  if (result.source === 'agent') {
    let { parameters, metadata } = result;
    
  } else if (result.source === 'domains') {
      message = createTextMsg(result.fulfillment.speech);
  }

  message.set_attributes = Object.assign(message.set_attributes || {}, { DF_SESSION_ID: sessionId });
  response.send(message);
}

let handleError = (response) => (error) => {
	let message = { error };
	response.send(message);
}

let handleAI = ({ query }, res) => {
  let { DF_SESSION_ID, DF_CONTEXT, queryString } = query;

  let newSessionId = (!DF_SESSION_ID || DF_SESSION_ID === "0") ? Math.random().toString().slice(2) : 0;
  let sessionId = (DF_SESSION_ID && DF_SESSION_ID != "0") ? DF_SESSION_ID : newSessionId;
  
  let name = (DF_CONTEXT || 'DEFAULT');
  let parameters = query;
  let contexts = [{ name, parameters }];
  
  let request = API_AI_APP.textRequest(queryString, { sessionId, contexts });

	request.on('response', handleResponse(res));
	request.on('error', handleError(res));
	request.end();
}

module.exports = handleAI;