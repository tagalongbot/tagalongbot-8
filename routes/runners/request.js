let express = require('express');
let router = express.Router();

let { getRunnerByMessengerID, updateRunner } = require('../../libs/data/runners.js');

let { createBtn, createGallery } = require('../../libs/bots.js');

let { sendBroadcast } = require('../../libs/chatfuel.js');

let sendRequest = async ({ params, query }, res) => {
  let { zip_code } = params;
  let { messenger_user_id, runner_messenger_user_id} = query;

  let runner = await getRunnerByMessengerID(messenger_user_id);

  let user_id = runner_messenger_user_id;
  let block_name = '[Notification] New Request';

  let user_attributes = {
    ['runner_name']: `${runner.fields['First Name']} ${runner.fields['Last Name']}`,
    ['runner_zip_code']: runner.fields['Zip Code'],
  }

  let sent_broadcast = await sendBroadcast(
    { user_id, block_name, user_attributes }
  );

  let redirect_to_blocks = ['Request Sent'];

  res.send({ redirect_to_blocks });
}

let acceptRequest = async ({ query }, res) => {

}

router.get(
  '/',
  sendRequest,
);

router.get(
  '/accept',
  acceptRequest,
);

module.exports = router;