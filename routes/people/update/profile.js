let { getPersonByMessengerID, getPersonByPhoneNumber, updatePerson } = require('../../../libs/data/people.js');

let updateProfile = async ({ query }, res) => {
  let { messenger_user_id, messenger_link, latitude, longitude, zip_code, city, state, country } = query;

  let person = await getPersonByMessengerID(messenger_user_id);

  if (!person) {
    let redirect_to_blocks = ['Profile Not Created'];
    res.send({ redirect_to_blocks });
    return;
  }

  let update_data = {
    ['Messenger Link']: messenger_link,
    ['Latitude']: latitude,
    ['Longitude']: longitude,
    ['Zip Code']: zip_code,
    ['City']: city,
    ['State']: state,
    ['Country']: country,
  }

  let redirect_to_blocks = ['Profile Updated'];

  let updated_person = await updatePerson(update_data, person);
}

module.exports = updateProfile;