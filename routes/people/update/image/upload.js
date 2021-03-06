let { getPersonByMessengerID, updatePerson } = require('../../../../libs/data/people.js');

let { uploadCloudinaryImage, getFaceFromImage } = require('../../../../libs/cloudinary.js');

let uploadProfileImage = async ({ query }, res) => {
  let { messenger_user_id, new_profile_image } = query;

  let person = await getPersonByMessengerID(messenger_user_id);
  let person_image_fields = Object.keys(person.fields).filter(field => field.startsWith('Profile Image URL')).map(field => person.fields[field]);

  let new_profile_image_url = await uploadCloudinaryImage(
    { image_url: new_profile_image }
  );

  let face_profile_image_url = getFaceFromImage(
    { image_url: new_profile_image_url }
  );

  let next_image_index = person_image_fields.length + 1;
  let update_data = {
    ['Profile Image URL ' + next_image_index]: face_profile_image_url,
  }

  let redirect_to_blocks = ['Profile Image Uploaded'];

  let updated_person = await updatePerson(update_data, person);

  res.send({ redirect_to_blocks });
}

module.exports = uploadProfileImage;