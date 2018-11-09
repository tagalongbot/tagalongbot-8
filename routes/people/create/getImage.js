let { getPersonByMessengerID, updatePerson } = require('../../libs/data/people.js');

let { uploadCloudinaryImage, getFaceFromImage } = require('../../libs/cloudinary.js');

let getImage = async ({ query }, res) => {
  let { profile_image } = query;

  let new_profile_image_url = await uploadCloudinaryImage(
    { image_url: profile_image }
  );

  let face_profile_image_url = await getFaceFromImage(
    { image_url: new_profile_image_url }
  );

  console.log('face_profile_image_url', face_profile_image_url);

  let redirect_to_blocks = ['New Profile Created'];

  res.send({ redirect_to_blocks });
}

module.exports = getImage;