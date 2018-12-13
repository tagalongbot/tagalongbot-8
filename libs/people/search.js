let { BASEURL } = process.env;

let { createBtn } = require('../../libs/bots.js');
let { createURL } = require('../../libs/helpers/strings.js');

let createPeopleCards = (person) => {
  let person_messenger_user_id = person.fields['messenger user id'];

  let is_person_verified = person.fields['Verified?'];

  let title = `${person.fields['First Name']} ${person.fields['Age']}`;
  let subtitle = `${person.fields['City']} | ${person.fields['Country']}`;
  if (is_person_verified) subtitle = `Verified User ✅ | ${subtitle} `;

  let image_url = `${person.fields['Profile Image URL']}`;

  let send_tag_btn = createBtn(
    `Tag!|show_block|[JSON] Send Tag`,
    { person_messenger_user_id }
  );

  let next_profile_btn = createBtn(
    `Next|show_block|[JSON] Browse Profiles`,
  );

  let view_profile_url = createURL(
    `${BASEURL}/people/view/profile`,
    { person_messenger_user_id }
  );

  let view_profile_btn = createBtn(
    `View Profile|web_url|${view_profile_url}`
  );

  let buttons = [send_tag_btn, next_profile_btn, view_profile_btn];

  return { title, subtitle, image_url, buttons };
}

module.exports = {
  createPeopleCards,
}