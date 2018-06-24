let { BASEURL, PRACTICE_DATABASE_BASE_ID } = process.env;
let { createButtonMessage } = require('../../libs/bots.js');
let { createURL } = require('../../libs/helpers.js');
let { getTable, findTableData, updateTableData } = require('../../libs/data.js');

let getPracticesTable = getTable('Practices');

let practicesTable = getPracticesTable(PRACTICE_DATABASE_BASE_ID);
let findPractice = findTableData(practicesTable);
let updatePracticeTable = updateTableData(practicesTable);

let updatePractice = async ({ messenger_user_id, user_email, user_phone_number, practice }) => {
  let update_practice_data = {
    'Claimed?': true,
    'Claimed By Messenger User ID': messenger_user_id,
    'Claimed By Email': user_email,
    'Claimed By Phone Number': user_phone_number
  }

  let updated_practice = await updatePracticeTable(update_practice_data, practice);

  return updated_practice;
}

let createUpdateMsg = ({ practice, first_name }) => {
  let msg = createButtonMessage(
    `Congrats ${first_name} your practice "${practice.fields['Practice Name']}" has been claimed! We will reach out to you soon and activate your practice on Bevl Beauty`,
    `Main Menu|show_block|Discover Main Menu`,
    `About Bevl Beauty|show_block|AboutBB`,
  );
  
  return msg;
}

module.exports = {
  updatePractice,
  createUpdateMsg,
}