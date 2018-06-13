let { BASEURL, PRACTICE_DATABASE_BASE_ID } = process.env;
let express = require('express');
let router = express.Router();

let { createButtonMessage } = require('../libs/bots');
let { createURL } = require('../libs/helpers');

let { getTable, findTableData, updateTableData } = require('../libs/data');

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
  let { provider_id, gender, user_email, messenger_user_id, first_name, last_name } = query;

  let provider = await findPractice(provider_id);

  if (!provider) {
    let redirect_to_blocks = ['(Claim) Provider Not Available'];
    res.send({ redirect_to_blocks });
    return;
  }

  let updatePracticeData = {
    'Claimed?': true,
    'Claimed By Messenger User ID': messenger_user_id,
    'Claimed By Email': user_email,
  }

  let updatedPractice = await updatePractice(updatePracticeData, provider);

  let msg = createButtonMessage(
    `Congrats ${first_name} your practice "${provider.fields['Practice Name']}" has been claimed! We will reach out to you soon and activate your practice on Bevl Beauty`,
    `Main Menu|show_block|Discover Main Menu`,
    `About Bevl Beauty|show_block|AboutBB`,
  );

  let messages = [msg];
  res.send({ messages });
}

router.get('/email', askForUserEmail);
router.get('/', claimProvider);

module.exports = router;