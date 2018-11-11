let { getPersonByMessengerID, updatePerson } = require('../../../libs/data/people.js');

let { uploadCloudinaryImage, getFaceFromImage } = require('../../../libs/cloudinary.js');

let { createImage, createBtn, createQuickReplyMessage } = require();

let getImage = async ({ query }, res) => {
  let { profile_pic_url } = query;

  let new_profile_image_url = await uploadCloudinaryImage(
    { image_url: profile_pic_url }
  );

  let face_profile_image_url = getFaceFromImage(
    { image_url: new_profile_image_url }
  );

  let set_attributes = {
    profile_image: face_profile_image_url
  }

  let image_msg = createImage(face_profile_image_url);

  let quick_reply_1 = createBtn();

  let quick_replies = createQuickReplyMessage(
    `Is this a good image to use for your profile?`,
    
  );

  let messages = [];

  res.send({ set_attributes, messages });
}

module.exports = getImage;