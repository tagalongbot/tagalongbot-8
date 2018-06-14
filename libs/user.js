// This library is used for each user inside a practice base
let { BASEURL } = process.env;
let { createURL } = require('../libs/helpers.js');
let { getTable, getAllDataFromTable } = require('../libs/data.js');

let getUsersTable = getTable('Users');

