let express = require('express');
let router = express.Router();

let { getPersonByMessengerID, updateRunner } = require('../../libs/data/runners.js');
let { createMatch } = require('../../libs/data/matches.js');

let { createRequestedRunnerCard } = require('../../libs/runners/request.js');

let { createGallery } = require('../../libs/bots.js');

let { sendBroadcast } = require('../../libs/chatfuel.js');

let sendRequest = async ({ query }, res) => {
  let { messenger_user_id, person_messenger_user_id } = query;

  let user_id = person_messenger_user_id;
  let block_name = '[JSON] Get Runner Request Gallery';

  let user_attributes = {
    ['person_messenger_user_id']: messenger_user_id,
  }

  let sent_broadcast = await sendBroadcast(
    { user_id, block_name, message_tag: 'PAIRING_UPDATE', user_attributes }
  );

  let redirect_to_blocks = ['Request Sent'];

  res.send({ redirect_to_blocks });
}

let acceptRequest = async ({ query }, res) => {
  let { messenger_user_id, person_messenger_user_id } = query;

  let person = await getPersonByMessengerID(messenger_user_id);
  let accepted_person = await getPersonByMessengerID(person_messenger_user_id);

  let new_match_data = {
    ['Runner 1 - Name']: `${person.fields['First Name']} ${person.fields['Last Name']}`,
    ['Runner 2 - Name']: `${accepted_person.fields['First Name']} ${accepted_person.fields['Last Name']}`,
  }

  let new_match = await createMatch(new_match_data);

  let user_id = person_messenger_user_id;
  let block_name = '[Notification] Request Accepted';

  let user_attributes = {
    ['person_messenger_link']: person.fields['Messenger Link'],
  }

  let sent_broadcast = await sendBroadcast(
    { user_id, block_name, message_tag: 'PAIRING_UPDATE', user_attributes }
  );

  let redirect_to_blocks = ['Accept Request'];

  res.send({ redirect_to_blocks });
}

let sendRequestedRunner = async ({ query }, res) => {
  let { messenger_user_id, first_name, person_messenger_user_id } = query;

  let requested_person = await getPersonByMessengerID(person_messenger_user_id);

  let requested_person_card = createRequestedRunnerCard(
    { requested_person }
  );

  let gallery = createGallery([requested_person_card], 'square');

  let textMsg = { text: `Hey ${first_name} you have a new running partner request` };
  let messages = [textMsg, gallery];

  res.send({ messages });
}

router.get(
  '/',
  sendRequest,
);

router.get(
  '/accept',
  acceptRequest,
);

router.get(
  '/runner',
  sendRequestedRunner
);

module.exports = router;