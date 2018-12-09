let riot = require('riot');

let check_boxes_tag = require('../../../tags/check-boxes.tag');
let view_template = require('../../../views/check-boxes.marko');

let { getPersonByMessengerID } = require('../../../libs/data/people.js');

let { capitalizeString } = require('../../../libs/helpers/strings.js');

let viewProfileInterests = async ({ query }, res) => {
  let { person_messenger_user_id } = query;

  let person = await getPersonByMessengerID(person_messenger_user_id);

  let title = 'Interests';
  let options = ['Running', 'Cycling', 'Gym', 'Religion', 'Travel', 'Anime/Manga', 'Food', 'Internet', 'Painting/Doodling', 'Volunteering', 'Science/Tech', 'Writing', 'Dance', 'Gym', 'Korean Culture', 'Photography', 'Sports', ''];
  
  let person_data = {
    ['first_name']: person.fields['First Name'],
    ['last_name']: person.fields['Last Name'],
    ['gender']: capitalizeString(person.fields['Gender']),
    ['activities']: person.fields['Activities'].join(' | '),
    ['profile_image_url']: person.fields['Profile Image URL']
  }

  let view_html = riot.render(
    check_boxes_tag,
    { person: person_data }
  );

  res.marko(
    view_template,
    { view_html }
  );
}

module.exports = viewProfileInterests;