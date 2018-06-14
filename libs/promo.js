let { BASEURL } = process.env;
let { createURL } = require('../libs/helpers.js');
let { getTable, getAllDataFromTable } = require('../libs/data.js');

let getPromosTable = getTable('Promos');
