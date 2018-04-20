let { PRACTICE_DATABASE_BASE_ID, USERS_BASE_ID, SERVICES_BASE_ID } = process.env;
let { createGallery } = require('../libs/bots');
let { getTable, getAllDataFromTable, findTableData, createTableData, updateTableData, destroyTableData } = require('../libs/data');

// Tables
let getUsersTable = getTable('Users');
let getUsersTable = getTable('Practices');
// let getUsersTable = getTable('Services');

let getUsers = getAllDataFromTable(USERS_BASE_ID);
let getUsers = getAllDataFromTable(SERVICES_BASE_ID);
let getUsers = getAllDataFromTable();