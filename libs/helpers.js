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

module.exports = {
	createURL,
	randomize,
	shuffleArray,
	getKeysStartingWith,
	formatPhoneNumber,
  toUniqueArray,
}