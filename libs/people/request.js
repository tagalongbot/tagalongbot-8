let { createBtn } = require('../../libs/bots.js');

let createRequestedPartnerCard = (data) => {
  let { requested_partner } = data;

  let person = requested_partner.fields;

  let person_messenger_user_id = person['messenger user id'];
  let person_messenger_link = person['Messenger Link'];

  let isPersonVerified = person['Verified?'];

  let title = `${person['First Name']} ${person['Last Name']}`;
  let subtitle = `${person['Gender']} | ${person['Zip Code']}`;

  if (isPersonVerified) subtitle = `Verified User ✅ | ${subtitle} `;

  let image_url = person['Profile Image URL'];

  let accept_request_btn = createBtn(
    `Accept Request|show_block|[JSON] Accept Partner Request`,
    { person_messenger_user_id, person_messenger_link }
  );

  let buttons = [accept_request_btn];

  return { title, subtitle, image_url, buttons };
}

module.exports = {
  createRequestedPartnerCard,
}