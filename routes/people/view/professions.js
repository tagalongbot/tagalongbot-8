let riot = require('riot');

let user_profile_tag = require('../../../tags/user-profile.tag');
let view_template = require('../../../views/user-profile.marko');

let { getPersonByMessengerID } = require('../../../libs/data/people.js');

let { capitalizeString } = require('../../../libs/helpers/strings.js');

let viewProfileProfessions = async ({ query }, res) => {
  let { person_messenger_user_id } = query;

  let person = await getPersonByMessengerID(person_messenger_user_id);

  let person_data = {
    ['first_name']: person.fields['First Name'],
    ['last_name']: person.fields['Last Name'],
    ['gender']: capitalizeString(person.fields['Gender']),
    ['activities']: person.fields['Activities'].join(' | '),
    ['profile_image_url']: person.fields['Profile Image URL']
  }

  let view_html = riot.render(
    user_profile_tag,
    { person: person_data }
  );

  res.marko(
    view_template,
    { view_html }
  );
}

module.exports = viewProfileProfessions;