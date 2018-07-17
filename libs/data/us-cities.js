let fs = require('fs');

let readJSONFile = (file_name) => {
  let file = fs.readFileSync(
    file_name, 
  );

  let json = JSON.parse(
    file.toString()
  );
  
  return json;
}

let stateInitials = readJSONFile('.data/state_hashes.json');
let stateAbbreviations = readJSONFile('.data/state_abbreviations.json');

let getStateByInitials = (initials) => {
  return stateInitials[initials.toUpperCase()];
}

let getAbbreviationByState = (state_name) => {
  let obj = stateAbbreviations.find(
    data => data.name.toLowerCase() === state_name.toLowerCase()
  );
  return obj.abbreviation;
}

module.exports = {
  getStateByInitials,
  getAbbreviationByState,
}