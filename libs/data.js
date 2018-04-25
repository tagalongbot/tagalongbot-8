let Airtable = require('airtable');

// Lib Helper Methods
let errorHandler = (resolve, reject) => (error, record) => {
	if (error) {
		console.trace();
    console.log('Airtable Error:', error);
		reject({ error });
		return;
	}

	resolve(record);
}

let getOnlyValuesFromData = (data) => {
	let newData = {};

	for (let key in data) {
		if (data[key] !== undefined) newData[key] = data[key];
	}

	return newData;
}

// Lib Methods
let getTable = (tableName) => (baseID) => {
	let base = Airtable.base(baseID);
	let table = base(tableName);
	return table;
}

let getDataFromTable = (table) => (filterQuery = {}) => {
	return new Promise((resolve, reject) => {
		table.select(filterQuery)

		.firstPage(
			errorHandler(resolve, reject)
		);
	});
}

let getAllDataFromTable = (table) => (filterQuery = {}) => {
	return new Promise((resolve, reject) => {
		table.select(filterQuery)

		.all(
			errorHandler(resolve, reject)
		);
	});
}

let findTableData = (table) => (data_ID) => {
	return new Promise(function(resolve, reject) {
		table.find(
			data_ID,
			errorHandler(resolve, reject)
		);
	});
}

let createTableData = (table) => (data) => {
	let newData = getOnlyValuesFromData(data);
	return new Promise(function(resolve, reject) {
		table.create(
			newData,
			errorHandler(resolve, reject)
		);
	});
}

let updateTableData = (table) => (updateData, dataRecord) => {
	let newData = getOnlyValuesFromData(updateData);

	return new Promise((resolve, reject) => {
		table.update(
			dataRecord.id,
			newData,
			errorHandler(resolve, reject)
		);
	});
}

let destroyTableData = (table) => (data_ID) => {
	return new Promise(function(resolve, reject) {
		table.destroy(
			data_ID,
			errorHandler(resolve, reject)
		);
	});
}

module.exports = {
	getTable,
	getDataFromTable,
	getAllDataFromTable,
	findTableData,
	createTableData,
	updateTableData,
	destroyTableData,
}