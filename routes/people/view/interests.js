let riot = require('riot');

let check_boxes_tag = require('../../../tags/check-boxes.tag');
let view_template = require('../../../views/check-boxes.marko');

let { getPersonByMessengerID } = require('../../../libs/data/people.js');

let getInterests = function () {
  let title = 'Interests';
  let check_boxes = ['American TV Series', 'Anime/Manga', 'Books', 'Cycling', 'Dance', 'Fashion', 'Food', 'Gaming', 'Gym', 'Hollywood Movies', 'Internet', 'Karaoke', 'Korean Culture', 'Music', 'Painting/Doodling', 'Pets', 'Photography', 'Religion', 'Running', 'Science/Tech', 'Sports', 'Travel', 'Volunteering', 'Writing', 'Yoga/Meditation']
    .map(option => {
      let checked = person_interests.includes(option);
      return { label: option, checked };
    });

  let title = 'Professions';
  let check_boxes = ['Accountant', 'Actor', 'Actuary', 'Architect', 'Artist', 'Aviator', 'Broker', 'Butcher', 'Chef', 'Consultant', 'Dental Hygienist', 'Dentist', 'Designer', 'Dietitian', 'Electrician', 'Engineer', 'Firefighter', 'Hairdresser', 'Health Professional', 'Journalist', 'Judge', 'Labourer', 'Lawyer', 'Librarian', 'Machinist', 'Mechanic', 'Medical Laboratory Scientist', 'Midwife', 'Musician', 'Operator', 'Paramedic', 'Pharmacist', 'Physician', 'Physiotherapist', 'Plumber', 'Police Officer', 'Psychologist', 'Radiographer', 'Scientist', 'Secretary', 'Software Developer', 'Statistician', 'Student', 'Surgeon', 'Surveyor', 'Teacher', 'Technician', 'Technologist', 'Tradesman', 'Veterinarian', 'Waiting staff']
    .map(option => {
      let checked = person_professions.includes(option);
      return { label: option, checked };
    });
  
  
}

let viewProfileInterestsProfessions = async ({ query }, res) => {
  let { messenger_user_id } = query;

  let person = await getPersonByMessengerID(messenger_user_id);
  let person_interests = person.fields['Interests'];
  let person_professions = person.fields['Professions'];


  let view_html = riot.render(
    check_boxes_tag,
    { title, messenger_user_id, options: JSON.stringify(options) }
  );

  res.marko(
    view_template,
    { view_html, title, messenger_user_id, options: JSON.stringify(options) }
  );
}

module.exports = viewProfileInterestsProfessions;