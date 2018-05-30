let { BASEURL, PRACTICE_DATABASE_BASE_ID } = process.env;
let { createButtonMessage, createTextMessage } = require('../libs/bots');
let { createURL } = require('../libs/helpers');

let express = require('express');
let router = express.Router();

let { getTable, findTableData, createTableData, updateTableData } = require('../libs/data');

let getPracticesTable = getTable('Practices');

let practicesTable = getPracticesTable(PRACTICE_DATABASE_BASE_ID);
let findPractice = findTableData(practicesTable);
let updatePractice = updateTableData(practicesTable);

let askForUserEmail = async ({ query }, res) => {
  let { provider_id } = query;

  let redirect_to_blocks = ['Ask For Email (Practice)'];
  let set_attributes = { provider_id };
  res.send({ redirect_to_blocks, set_attributes });
}

let claimProvider = async ({ query }, res) => {
  let { provider_id, gender, user_email } = query;
  let messenger_user_id = query['messenger user id'];
  let first_name = query['first name'];
  let last_name = query['last name'];

  let provider = await findPractice(provider_id);

  let updatePracticeData = {
    'Claimed?': true,
    'Claimed By Messenger User ID': messenger_user_id,
    'Claimed By Email': user_email,
  }

  let updatedPractice = await updatePractice(updatePracticeData, provider);

  let txtMsg = createButtonMessage(
    `Congrats ${first_name} your practice "${provider.fields['Practice Name']}" has been claimed!`,
    `Search More Providers|show_block|Search Providers`,
  );

  let messages = [txtMsg];
  res.send({ messages });
}

router.get('/email', askForUserEmail);
router.get('/', claimProvider);

module.exports = router;