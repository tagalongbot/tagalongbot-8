let { BASEURL } = process.env;

let { getPersonByMessengerID } = require('../../libs/data/people.js');
let { createURL } = require('../../libs/helpers/strings.js');
let { createBtn } = require('../../libs/bots.js');

let toTagsGallery = async (tag) => {
  let person_messenger_user_id = tag.fields['Profile Messenger User ID'];
  let person = await getPersonByMessengerID(person_messenger_user_id);

  let is_person_verified = person.fields['Verified?'];

  let title = `${person.fields['First Name']} | Age: ${person.fields['Age']}`;
  let subtitle = `${person.fields['Gender']} | ${person.fields['City']} | ${person.fields['Country']}`;
  if (is_person_verified) subtitle = `Verified User ✅ | ${subtitle}`;

  let image_url = Object.keys(person.fields)
    .filter(field => field.startsWith('Profile Image URL'))
    .map(field => person.fields[field])[0];

  let view_profile_url = createURL(
    `${BASEURL}/people/view/profile`,
    { tagged_person_messenger_id: person_messenger_user_id }
  );

  let view_profile_btn = createBtn(
    `View Profile|web_url|${view_profile_url}`,
  );

  let buttons = [view_profile_btn];

  return { title, subtitle, image_url, buttons };
}

module.exports = {
  toTagsGallery,
}