let Airtable = require('airtable');

Airtable.configure({
	endpointUrl: 'https://api.airtable.com',
	apiKey: process.env.AIRTABLE_API_KEY
});

let reservedkeys = [
	'base_id',
	'user_created_block',
	'user_updated_block',
];

let createMissingParameterMsg = (parameterName) => {
  let text = `"${parameterName}" query parameter missing on JSON URL endpoint`;
  let textMsg = { text };
  let messages = [textMsg];
  return { messages };
}

let errorHandler = (res, query, type) => (error, record) => {
  let { user_created_block, user_updated_block } = query;
  let response = { redirect_to_blocks: [] };

  if (error) {
      let error_source = 'airtable';
      res.send({ error_source, error });
      return;
  }

  if (type === 'create' && user_created_block) {
      response.redirect_to_blocks = [user_created_block];
  } else if (type === 'update' && user_updated_block) {
      response.redirect_to_blocks = [user_updated_block];
  } else {
      response = {};
  }

  res.send(response);
}

let getOnlyUserData = (data) => {
  let toUserData = (newObj, key) => {
    if (reservedkeys.includes(key.toLowerCase())) return newObj;
    newObj[key] = data[key];
    return newObj;
	}

	return Object.keys(data).reduce(toUserData, {});
}

let getAndUpdateData = (res, query, dataTable) => (error, records) => {
  if (error) {
    let error_source = 'airtable';
    res.send({ error_source, error });
    return;
  }

  let user = records[0];
  let data = getOnlyUserData(query);
  if (!user) {
    dataTable.create(
      data,
      errorHandler(res, query, 'create')
    );
    return;
  }

  dataTable.update(
    user.id,
    data,
    errorHandler(res, query, 'update')
  );
}

let exportData = ({ query }, res) => {
  let { base_id } = query;
  if (!base_id) {
    let msg = createMissingParameterMsg('base_id');
    res.send(msg);
    return;
  }
    
  let messenger_user_id = query['messenger user id'];
	if (!messenger_user_id) {
    let msg = createMissingParameterMsg('messenger user id');
    res.send(msg);
    return;
  }
	
	let base = Airtable.base(base_id);
  let dataTable = base('Data');

  let maxRecords = 1;
  let fields = ['messenger user id'];
  let filterByFormula = `{messenger user id} = '${messenger_user_id}'`;

  dataTable.select({ maxRecords, fields, filterByFormula })
  
  .firstPage(
    getAndUpdateData(res, query, dataTable)
  );
}

module.exports = exportData;