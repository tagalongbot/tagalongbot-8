let createURL = (url, obj = {}) => {
	return Object.keys(obj).reduce(function(query, key, index) {
		if (index === 0) query += '?';
		if (index > 0) query += '&';
		query += `${encodeURI(key)}=${encodeURI(obj[key])}`;
		return query;
	}, url);
}

let getKeysStartingWith = (obj, startingWith) => {
	return Object.keys(obj).filter(key => key.startsWith(startingWith));
}

let getNumbersOnly = (phone_number) => {
  return phone_number.match(/\d/g).join('');
}

let formatPhoneNumber = (phone_number) => {
	let splitPhoneNumber = phone_number.match(/\d/g).join('');
	let phoneNumberString = `(${splitPhoneNumber.slice(0, 3)}) ${splitPhoneNumber.slice(3, 6)}-${splitPhoneNumber.slice(6)}`;
	return phoneNumberString;
}

let capitalizeString = (str = '') => {
  if (str === '') return '';
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

let convertStringToBase64 = (str) => {
  return Buffer.from(str).toString('base64');
}

let createRandomNumber = (len) => {
  let new_random_number = String(Math.random()).slice(2, len+2);
  return new_random_number;
}

module.exports = {
	createURL,
  capitalizeString,
	getKeysStartingWith,
  getNumbersOnly,
	formatPhoneNumber,
  convertStringToBase64,
  createRandomNumber,
}