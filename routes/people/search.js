let { shuffleArray } = require('../../libs/helpers/arrays.js');

let { getPersonByMessengerID, searchNearbyPeopleByZipCode, searchNearbyPeopleByCity, createPerson } = require('../../libs/data/people.js');

let { uploadCloudinaryImage, getFaceFromImage } = require('../../libs/cloudinary.js');

let { createGallery } = require('../../libs/bots.js');

let { createPeopleCards } = require('../../libs/people/search.js');

let searchPeople = async ({ query }, res) => {
  let { messenger_user_id, search_activity, search_gender, zip_code, city, latitude, longitude } = query;

  let person_searching = await getPersonByMessengerID(messenger_user_id);

  if (!person_searching) {
    let redirect_to_blocks = ['Profile Not Created'];
    res.send({ redirect_to_blocks });
    return;
  }

  let people = await searchNearbyPeopleByCity(
    { city }
  );

  let matched_people = people.filter(
    person =>
      person.id != person_searching.id &&
      (person.fields['Match By Gender'] === search_gender.toLowerCase() || person.fields['Match By Gender'] === 'both') &&
      person.fields['Activities'] && person.fields['Activities'].includes(search_activity)
  );

  if (!matched_people[0]) {
    let redirect_to_blocks = ['No Partners Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let gallery_data = shuffleArray(matched_people)
    .slice(0, 1)
    .map(createPeopleCards);

  let gallery = createGallery(gallery_data, 'square');

  let messages = [gallery];

  res.send({ messages });
}

module.exports = searchPeople;