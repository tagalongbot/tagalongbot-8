let fs = require('fs');
let { promisify } = require('util');
let appendFile = promisify(fs.appendFile);

let createURL = (url, obj = {}) => {
	return Object.keys(obj).reduce(function(query, key, index) {
		if (index === 0) query += '?';
		if (index > 0) query += '&';
		query += `${encodeURI(key)}=${encodeURI(obj[key])}`;
		return query;
	}, url);
}

let randomize = (arr) => {
	return arr[Math.floor(Math.random() * arr.length)];
}

let shuffleArray = (array) => {
	let counter = array.length;

	while (counter > 0) {
		let index = Math.floor(Math.random() * counter);

		counter--;

		let temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
}

let getKeysStartingWith = (obj, startingWith) => {
	return Object.keys(obj).filter(key => key.startsWith(startingWith));
}

let formatPhoneNumber = (phone_number) => {
	let splitPhoneNumber = phone_number.match(/\d/g).join('');
	let phoneNumberString = `(${splitPhoneNumber.slice(0, 3)}) ${splitPhoneNumber.slice(3, 6)}-${splitPhoneNumber.slice(6)}`;
	return phoneNumberString;
}

let toUniqueArray = (arr, val) => {
  if ( !arr.includes(val) ) {
    return arr.concat(val);
  }
  return arr;
}

let localizeDate = (date) => {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

let flattenArray = (arr) => {
  return [].concat.apply([], arr);
}

let flattenDeepArray = (x) => {
  return Array.isArray(x) ? [].concat(...x.map(flattenDeepArray)) : x;
}

let timeout = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let logError = async (error) => {
  let path = '.data/errors.txt';
  let date = new Date();
  let new_error = `\nNew Error: ${date.toString()}|${JSON.stringify(error)}`;
  let new_appended_error = await appendFile(path, new_error);
}

let logToFile = async (logMsg) => {
  let path = '.data/logs.txt';
  let date = new Date();
  let new_log_msg = `\nNew Log: ${date.toString()}|${logMsg}`;
  let logged_message = await appendFile(path, new_log_msg);
}

module.exports = {
	createURL,
	randomize,
	shuffleArray,
	getKeysStartingWith,
	formatPhoneNumber,
  toUniqueArray,
  localizeDate,
  flattenArray,
  flattenDeepArray,
  timeout,
  logError,
  logToFile,
}