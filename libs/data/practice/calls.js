// This library is used for managing calls for each practice
let { getTable, getAllDataFromTable, findTableData, createTableData, updateTableData } = require('../../../libs/data.js');

let getCallsTable = getTable('Calls');

let getPracticeCall = async ({ practice_calls_base_id, call_id }) => {
  let callsTable = getCallsTable(practice_calls_base_id);
  let findCall = findTableData(callsTable);
  let call = await findCall(call_id);
  return call;
}

let getPracticeCalls = async ({ practice_calls_base_id, view = 'Main View' }) => {
  let callsTable = getCallsTable(practice_calls_base_id);
  let getCalls = getAllDataFromTable(callsTable);

  let calls = await getCalls({ view });
  return calls;
}

let createPracticeCall = async ({ practice_calls_base_id, call_data }) => {
  let callsTable = getCallsTable(practice_calls_base_id);
  let createCall = createTableData(callsTable);
  
  let new_call = await createCall(call_data);
  return new_call;
}

let updatePracticeCall = async ({ practice_calls_base_id, call_data, call }) => {
  let callsTable = getCallsTable(practice_calls_base_id);
  let updateCall = updateTableData(callsTable);

  let updated_call = await updateCall(call_data, call);
  return updated_call;
}

module.exports = {
  getPracticeCall,
  getPracticeCalls,
  createPracticeCall,
  updatePracticeCall,
}