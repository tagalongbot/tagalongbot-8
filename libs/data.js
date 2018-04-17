let NAMED_QUICK_REPLIES = require('../named_quick_replies');

let createButtons = (...btns) => {
	let ctas = btns.map(function(btn) {
		let [type, label, url] = btn.split('|');
		let button = { type, label, url };
		return button;
	});

	return ctas;
}

let createQuickReply = (label, metadata, description) => {
	return { label, metadata, description };
}

let createQuickReplyByName = (key) => {
	let quick_reply = NAMED_QUICK_REPLIES[key];
	return quick_reply;
}

let createQuickReplyTextInput = (label, metadata, keyboard = 'default') => {
	let type = 'text_input';
	let text_input = { keyboard, label, metadata };
	let quick_reply = { type, text_input };
	return quick_reply;
}

let createMessageEvent = (recipient_id, message_data) => {
	let type = 'message_create';
	let target = { recipient_id };
	let message_create = { target, message_data };
	let event = { type, message_create };
	return { event };
}

module.exports = {
	createButtons,
	createQuickReply,
	createQuickReplyByName,
	createQuickReplyTextInput,
	createMessageEvent,
}