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

let uploadCloudinaryImage = async (data) => {
  let { image_url } = data;

  let tags = ['RunWithMe'];

  let new_image = await uploadImage(
    image_url,
    { tags }
  );

  console.log('new_image', new_image);
  return new_image;
}

let getFaceFromImage = (data) => {
  let { image_url } = data;
  
  let face_transformation = 'c_crop,g_face,w_600,x_271,y_388';
  let face_url = image_url.split('upload/').join(
    `upload/${face_transformation}`
  );

  return face_url;
}

module.exports = {
  uploadCloudinaryImage,
  getFaceFromImage,
}