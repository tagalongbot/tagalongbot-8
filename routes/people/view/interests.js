let riot = require('riot');

let check_boxes_tag = require('../../../tags/check-boxes.tag');
let view_template = require('../../../views/check-boxes.marko');

let { getPersonByMessengerID } = require('../../../libs/data/people.js');

let viewProfileInterests = async ({ query }, res) => {
  let { messenger_user_id } = query;

  let person = await getPersonByMessengerID(messenger_user_id);
  let person_interests = person.fields['Interests'];

  let title = 'Interests';
  let options = ['American TV Series', 'Anime/Manga', 'Books', 'Cycling', 'Dance', 'Fashion', 'Food', 'Gaming', 'Gym', 'Hollywood Movies', 'Internet', 'Karaoke', 'Korean Culture', 'Music', 'Painting/Doodling', 'Pets', 'Photography', 'Religion', 'Running', 'Science/Tech', 'Sports', 'Travel', 'Volunteering', 'Writing', 'Yoga/Meditation']
    .map(option => {
      let checked = person_interests.includes(option);
      return { label: option, checked };
    });

  let view_html = riot.render(
    check_boxes_tag,
    { title, messenger_user_id, options: JSON.stringify(options) }
  );

  res.marko(
    view_template,
    { view_html, title, messenger_user_id, options: JSON.stringify(options) }
  );
}

module.exports = viewProfileInterests;