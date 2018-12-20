let util = require('util');
let placename = require('placename');

let getLocation = util.promisify(placename.bind(placename));

let { getPersonByMessengerID, createPerson } = require('../../libs/data/people.js');

let { uploadCloudinaryImage, getFaceFromImage } = require('../../libs/cloudinary.js');

let { capitalizeString } = require('../../libs/helpers/strings.js');

let createProfile = async ({ query }, res) => {
  let {
    messenger_user_id,
    first_name,
    last_name,
    gender,
    profile_age,
    profile_city,
    messenger_link,
    profile_image,
  } = query;

  let person = await getPersonByMessengerID(messenger_user_id);

  if (person) {
    let redirect_to_blocks = ['Profile Already Created'];
    res.send({ redirect_to_blocks });
    return;
  }

  let [{ name: city, country }] = await getLocation(profile_city);

  let new_person_data = {
    ['messenger user id']: messenger_user_id,
    ['Active?']: true,
    ['First Name']: first_name,
    ['Last Name']: last_name,
    ['Gender']: gender.toLowerCase(),
    ['Age']: Number(profile_age),
    ['City']: capitalizeString(city),
    ['Country']: country,
    ['Messenger Link']: messenger_link,
    ['Profile Image URL 1']: profile_image,
    ['Is Profile Hidden']: 'NO',
  }

  let new_person = await createPerson(new_person_data);

  let redirect_to_blocks = ['New Profile Created'];

  res.send({ redirect_to_blocks });
}

module.exports = createProfile;