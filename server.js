let { API_AI_KEY } = process.env;
let API_AI = require('apiai');
let API_AI_APP = API_AI(API_AI_KEY);
let express = require('express');
let app = express();

let randomize = (arr) => arr[Math.floor(Math.random() * arr.length)];

let sendResponse = ({ response, message }) => {
	response.writeHead(200, { 'Content-Type': 'application/json' });
	response.end(
	    JSON.stringify(message)
	);
}

let createTextMsg = (text) => {
  return { messages: [{ text }] };
}

let handleResponse = (response) => ({ result, sessionId }) => {
	let message;
  if (result.source === 'agent') {
      let randomMsg = randomize(result.fulfillment.messages);
      message = randomMsg.payload ? randomMsg.payload : createTextMsg(randomMsg.speech);
  } else if (result.source === 'domains') {
      message = createTextMsg(result.fulfillment.speech);
  }

  message.set_attributes = Object.assign(message.set_attributes || {}, { DF_SESSION_ID: sessionId });
  sendResponse({ response, message });
}

let handleError = (response) => (error) => {
	let message = { error };
	sendResponse({ response, message });
}

app.get('/', ({ query }, res) => {
  let newSessionId = (!query.DF_SESSION_ID || query.DF_SESSION_ID === "0") ? Math.random().toString().slice(2) : 0;
  let sessionId = (query.DF_SESSION_ID && query.DF_SESSION_ID != "0") ? query.DF_SESSION_ID : newSessionId;
  let contexts = [{
      name: query.DF_CONTEXT || 'DEFAULT',
      parameters: query,
  }];
  let request = API_AI_APP.textRequest(query.queryString, { sessionId, contexts });

	request.on('response', handleResponse(res));
	request.on('error', handleError(res));
	request.end();
});

app.listen(3000, () => console.log('Running on PORT 3000'));