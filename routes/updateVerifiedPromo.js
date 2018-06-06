let { BASEURL, PRACTICE_DATABASE_BASE_ID } = process.env;
let { createButtonMessage } = require('../libs/bots');
let { createURL } = require('../libs/helpers');
let { getProviderByUserID } = require('../libs/provider');

let { getTable, findTableData } = require('../libs/data');

let getPracticesTable = getTable('Practices');
let practicesTable = getPracticesTable(PRACTICE_DATABASE_BASE_ID);
let findPractice = findTableData(practicesTable);
let getPromosTable = getTable('Promos');

let updateVerifiedPromo = async () => {
  
}

module.exports = updateVerifiedPromo;