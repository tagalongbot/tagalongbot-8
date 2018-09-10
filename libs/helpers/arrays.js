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

let toUniqueArray = (arr, val) => {
  if ( !arr.includes(val) ) {
    return arr.concat(val);
  }
  return arr;
}

let flattenArray = (arr) => {
  return [].concat.apply([], arr);
}

let flattenDeepArray = (x) => {
  return Array.isArray(x) ? [].concat(...x.map(flattenDeepArray)) : x;
}

let convertLongTextToArray = (long_text = '') => {
  let lines = long_text.split('\n');
  return lines.filter(Boolean);
}

module.exports = {
	randomize,
	shuffleArray,
  toUniqueArray,
  flattenArray,
  flattenDeepArray,
  convertLongTextToArray,
}