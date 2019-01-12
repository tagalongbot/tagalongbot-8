let express = require('express');
let router = express.Router();

let { getPersonByMessengerID, updatePerson } = require('../../libs/data/people.js');
let { getTagsByProfileMessengerID, getTagsForProfileMessengerID, createTag } = require('../../libs/data/tags.js');
let { sendBroadcast } = require('../../libs/chatfuel.js');

let notifyMatch = async ({ user_id, tag }) => {
  let block_name = '[JSON] Get Tag Broadcast';
  let message_tag = 'PAIRING_UPDATE';
  let user_attributes = { tag_id: tag.id };

  let match_broadcast = await sendBroadcast(
    { user_id, block_name, message_tag, user_attributes }
  );
}

let tagProfile = async ({ query }, res) => {
  let { messenger_user_id, tagged_person_messenger_id } = query;

  let profile_tags = await getTagsByProfileMessengerID(messenger_user_id);
  let existing_tag = profile_tags
    .find(tag => tag.fields['Tagged Profile Messenger ID'] === tagged_person_messenger_id);

  if (existing_tag) {
    let redirect_to_blocks = ['Tag Already Sent'];
    let tagged_person_name = existing_tag.fields['Tagged Profile Name'];
    let set_attributes = { tagged_person_name };
    res.send({ redirect_to_blocks, set_attributes });
    return;
  }

  let person = await getPersonByMessengerID(messenger_user_id);
  let person_name = `${person.fields['First Name']} ${person.fields['Last Name']}`;
  let tagged_person = await getPersonByMessengerID(tagged_person_messenger_id);
  let tagged_person_name = `${tagged_person.fields['First Name']} ${tagged_person.fields['Last Name']}`;

  let new_tag_data = {
    ['Profile Messenger User ID']: person.fields['messenger user id'],
    ['Profile Name']: person_name,
    ['Tagged Profile Messenger ID']: tagged_person.fields['messenger user id'],
    ['Tagged Profile Name']: tagged_person_name,
  }

  let new_tag = await createTag(new_tag_data);

  if (!new_tag) {
    let redirect_to_blocks = ['[Error] User'];
    res.send({ redirect_to_blocks });
    return;
  }

  let redirect_to_blocks = ['Tag Sent'];
  let set_attributes = { tagged_person_name };
  res.send({ redirect_to_blocks, set_attributes });

  // Broadcast
  let profile_tagged_by = await getTagsForProfileMessengerID(messenger_user_id);
  let matched_tag = profile_tagged_by.find(
    tag => tag.fields['Profile Messenger User ID'] === tagged_person_messenger_id
  );

  if (matched_tag) {
    console.log('here');
    await notifyMatch(({ user_id: tagged_person_messenger_id, tag: new_tag }));
    await notifyMatch(({ user_id: messenger_user_id, tag: matched_tag }));
  }
}

router.get(
  '/',
  tagProfile,
);

module.exports = router;