let { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

let util = require('util');

let cloudinary = require('cloudinary');

let uploadImage = util.promisify(
  cloudinary.v2.uploader.upload.bind(cloudinary.v2.uploader)
);

cloudinary.config({
  cloud_name: 'the3dwin',
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

let uploadFaceImage = async (data) => {
  let { image_url } = data;
  console.log('image_url', image_url);

  let eager = { width: 150, height: 100, crop: 'thumb', gravity: 'face' };
  let tags = ['RunWithMe'];

  let new_image = await uploadImage(
    image_url,
    { eager, tags }
  );

  console.log('new_image', new_image);

  return new_image;
}

module.exports = {
  uploadFaceImage,
}