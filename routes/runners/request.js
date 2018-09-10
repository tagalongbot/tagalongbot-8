let express = require('express');
let router = express.Router();

let { getRunnerByMessengerID, getRunnersByZipCode, createRunner } = require('../../libs/data/runners.js');

let { createBtn, createGallery } = require('../../libs/bots.js');

let sendRequest = async ({ params, query }, res) => {
  let { zip_code } = params;
  let { messenger_user_id, runner_messenger_user_id} = query;

  let runner = await getRunnerByMessengerID(messenger_user_id);
  let requested_runner = await getRunnerByMessengerID(runner_messenger_user_id);

  let set_attributes = {  }

  let redirect_to_blocks = [];
  

  res.send({ messages });
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