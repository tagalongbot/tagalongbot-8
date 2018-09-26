let { getPersonByPhoneNumber, updatePerson } = require('../../libs/data/people.js');

let { uploadCloudinaryImage, getFaceFromImage } = require('../../libs/cloudinary.js');

let createNewPerson = async ({ query }, res) => {
  let { phone_number } = query;

  let person = await getPersonByPhoneNumber(phone_number);

  if (!person) {
    let redirect_to_blocks = ['[Verify] Person Not Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let update_data = {
    ['Verified?']: true
  }

  let updated_person = await updatePerson(update_data, person);

  let redirect_to_blocks = [''];
  res.send({ redirect_to_blocks });
}

module.exports = createNewPerson;