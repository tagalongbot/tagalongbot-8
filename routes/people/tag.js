let express = require('express');
let router = express.Router();

let { getPersonByMessengerID, updatePerson } = require('../../libs/data/people.js');
let { getTagsByProfileMessengerID, createTag } = require('../../libs/data/tags.js');

let tagProfile = async ({ query }, res) => {
  let { messenger_user_id, tagged_person_messenger_id } = query;

  let existing_tags = await getTagsByProfileMessengerID(messenger_user_id);
  let existing_tag = existing_tags
    .filter(tag => tag.fields['Tagged Profile Messenger ID'] === tagged_person_messenger_id);

  if (existing_tag.length > 0) {
    let redirect_to_blocks = ['Tag Already Sent'];
    let tagged_person_name = existing_tag.fields['Tagged Profile Name'];
    let set_attributes = { tagged_person_name };
    res.send({ redirect_to_blocks, set_attributes });
    return;
  }

  let person = await getPersonByMessengerID(messenger_user_id);
  let tagged_person = await getPersonByMessengerID(tagged_person_messenger_id);
  let tagged_person_name = `${tagged_person.fields['First Name']} ${tagged_person.fields['Last Name']}`;

  let new_tag_data = {
    ['Profile Messenger User ID']: person.fields['messenger user id'],
    ['Profile Name']: `${person.fields['First Name']} ${person.fields['Last Name']}`,
    ['Tagged Profile Messenger ID']: tagged_person.fields['messenger user id'],
    ['Tagged Profile Name']: tagged_person_name,
  }

  let new_tag = createTag(new_tag_data);

  if (!new_tag) {
    let redirect_to_blocks = ['[Error] User'];
    res.send({ redirect_to_blocks });
    return;
  }

  let redirect_to_blocks = ['Tag Sent'];
  let set_attributes = { tagged_person_name };
  res.send({ redirect_to_blocks, set_attributes });
}

router.get(
  '/',
  tagProfile,
);

module.exports = router;