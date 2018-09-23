let { createBtn } = require('../../libs/bots.js');

let createPeopleCards = (person) => {
  let person_messenger_user_id = person.fields['messenger user id'];

  let title = `${person.fields['First Name']} ${person.fields['Last Name']}`;
  let subtitle = person.fields['Gender'];
  let image_url = `${person.fields['Profile Image URL']}`;

  let send_request_btn = createBtn(
    `Send Request|show_block|[JSON] Send Partner Request`,
    { person_messenger_user_id }
  );

  let buttons = [send_request_btn];

  return { title, image_url, buttons };
}

module.exports = {
  createPeopleCards,
}