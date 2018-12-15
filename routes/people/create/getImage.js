let { uploadCloudinaryImage, getFaceFromImage } = require('../../../libs/cloudinary.js');

let { createImage, createBtn, createQuickReplyMessage } = require('../../../libs/bots.js');

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

  let quick_reply_1 = createBtn(
    `Yes|show_block|[JSON] Create Profile`,
  );

  let quick_reply_2 = createBtn(
    `No|show_block|[New Profile] Upload Image`,
  );

  let quick_replies = createQuickReplyMessage(
    `Is this a good face image to use for your profile?`,
    quick_reply_1,
    quick_reply_2,
  );

  let messages = [image_msg, quick_replies];

  res.send({ set_attributes, messages });
}

module.exports = getImage;