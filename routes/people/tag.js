let express = require('express');
let router = express.Router();

let { getPersonByMessengerID, updateRunner } = require('../../libs/data/people.js');
let { createTag } = require('../../libs/data/tags.js');

let sendTag = async ({ query }, res) => {
  let { messenger_user_id, person_messenger_user_id } = query;

  let redirect_to_blocks = ['Tag Sent'];

  res.send({ redirect_to_blocks });
}

router.get(
  '/',
  sendTag,
);

module.exports = router;