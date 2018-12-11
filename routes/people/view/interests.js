let riot = require('riot');

let check_boxes_tag = require('../../../tags/check-boxes.tag');
let view_template = require('../../../views/check-boxes.marko');

let { getPersonByMessengerID } = require('../../../libs/data/people.js');

let viewProfileInterests = async ({ query }, res) => {
  let { messenger_user_id } = query;

  let person = await getPersonByMessengerID(messenger_user_id);
  let person_interests = person.fields['Interests'];

  let title = 'Interests';
  let options = ['Running', 'Cycling', 'Gym', 'Religion', 'Travel', 'Anime/Manga', 'Food', 'Internet', 'Painting/Doodling', 'Volunteering', 'Science/Tech', 'Writing', 'Dance', 'Korean Culture', 'Photography', 'Sports', 'Yoga/Meditation', 'American TV Series', 'Fashion', 'Hollywood Movies', 'Music', 'Books', 'Gaming', 'Karaoke', 'Pets']
    .map(option => {
      let checked = person_interests.includes(option);
      return { label: option, checked };
    });

  let view_html = riot.render(
    check_boxes_tag,
    { title, options }
  );

  res.marko(
    view_template,
    { view_html, title, options: JSON.stringify(options) }
  );
}

module.exports = viewProfileInterests;