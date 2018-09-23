let express = require('express');
let router = express.Router();

let { getPersonByMessengerID, updateRunner } = require('../../libs/data/runners.js');
let { createMatch } = require('../../libs/data/matches.js');

let { createRequestedPartnerCard } = require('../../libs/runners/request.js');

let { createGallery } = require('../../libs/bots.js');

let { sendBroadcast } = require('../../libs/chatfuel.js');

let sendRequest = async ({ query }, res) => {
  let { messenger_user_id, person_messenger_user_id, requested_activity } = query;

  let user_id = person_messenger_user_id;
  let block_name = '[JSON] Get Runner Request Gallery';

  let user_attributes = {
    ['person_messenger_user_id']: messenger_user_id,
    ['requested_activity']: requested_activity,
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
    ['Person 1 - Name']: `${person.fields['First Name']} ${person.fields['Last Name']}`,
    ['Person 2 - Name']: `${accepted_person.fields['First Name']} ${accepted_person.fields['Last Name']}`,
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

let sendRequestedPartner = async ({ query }, res) => {
  let { messenger_user_id, first_name, person_messenger_user_id, requested_activity } = query;

  let requested_partner = await getPersonByMessengerID(person_messenger_user_id);

  let requested_partner_card = createRequestedPartnerCard(
    { requested_partner }
  );

  let gallery = createGallery([requested_partner_card], 'square');

  let textMsg = { text: `Hey ${first_name} you have a new ${requested_activity.toLowerCase()} partner request` };
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
  sendRequestedPartner
);

module.exports = router;