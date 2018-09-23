let { shuffleArray } = require('../../libs/helpers/arrays.js');

let { getPersonByMessengerID, searchNearbyPeopleByZipCode, createPerson } = require('../../libs/data/people.js');

let { uploadCloudinaryImage, getFaceFromImage } = require('../../libs/cloudinary.js');

let { createGallery } = require('../../libs/bots.js');

let { createPeopleCards } = require('../../libs/people/search.js');

let searchPeople = async ({ query }, res) => {
  let { messenger_user_id, search_gender, search_activity, zip_code, latitude, longitude } = query;

  let person_searching = await getPersonByMessengerID(messenger_user_id);

  if (!person_searching) {
    let redirect_to_blocks = ['Profile Not Created'];
    res.send({ redirect_to_blocks });
    return;
  }

  let people = await searchNearbyPeopleByZipCode(
    { zip_code }
  );

  let matched_people = people.filter(
    runner =>
      runner.id != person_searching.id &&
      runner.fields['Gender'].toLowerCase() === search_gender.toLowerCase() &&
      runner.fields['Activities'].includes(search_activity)
  );

  if (!matched_people[0]) {
    let redirect_to_blocks = ['No Partners Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let gallery_data = shuffleArray(matched_people)
    .slice(0, 10)
    .map(createPeopleCards);

  let gallery = createGallery(gallery_data, 'square');

  let textMsg = { text: `Here are some people near ${zip_code} in a 10 mile radius` };

  let messages = [textMsg, gallery];

  res.send({ messages });
}

module.exports = searchPeople;