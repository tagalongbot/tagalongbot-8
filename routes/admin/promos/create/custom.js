let handleRoute = require('../../../../middlewares/handleRoute.js');
let { localizeDate } = require('../../../../libs/helpers.js');
let { createExpirationDate } = require('../../../../libs/admin/promos/create.js');

let { getPracticeByUserID } = require('../../../../libs/data/practices.js');
let { getCustomCategoryByID } = require('../../../../libs/data/custom-images.js');
let { getCustomCategories, getCustomImagesByCategory } = require('../../../../libs/data/custom-images.js');

let { toCategoryGallery, toImagesGallery, createNewPromo } = require('../../../../libs/admin/promos/create/custom.js');
let { createMultiGallery } = require('../../../../libs/bots.js');

let express = require('express');
let router = express.Router();

let sendCustomCategories = async ({ query }, res) => {
  let { new_promo_name, new_promo_expiration_date } = query;

  let custom_promo_categories = await getCustomCategories();

  let galleryData = custom_promo_categories.map(
    toCategoryGallery({ new_promo_name, new_promo_expiration_date })
  );

  let messages = [
    { text: `Please choose an image category from below` }, 
    ...createMultiGallery(galleryData)
  ];

  res.send({ messages });
}

let sendCustomImages = async ({ query }, res) => {
  let { category_id, new_promo_name, new_promo_expiration_date } = query;

  let category = await getCustomCategoryByID(
    { category_id }
  );

  let category_name = category.fields['Category Name'];
  let custom_promo_images = await getCustomImagesByCategory(
    { category_name }
  );

  let galleryData = custom_promo_images.map(
    toImagesGallery({ new_promo_name, new_promo_expiration_date })
  );

  let messages = [
    { text: `Please choose an image below from ${category_name} to use for your new custom promo` }, 
    ...createMultiGallery(galleryData)
  ];

  res.send({ messages });
}

let sendSelectedImage = async ({ query }, res) => {
  let { new_promo_image_id } = query;

  let set_attributes = { new_promo_image_id };
  let redirect_to_blocks = ['New Custom Promotion Confirmation'];

  res.send({ set_attributes, redirect_to_blocks });
}

let updateExpirationDate = async ({ query }, res) => {
  let { new_promo_expiration_date } = query;

  let expiration_date = localizeDate(
    createExpirationDate(new_promo_expiration_date)
  );

  let set_attributes = {
    new_promo_expiration_date: expiration_date
  }

  res.send({ set_attributes });
}

let createCustomPromo = async ({ query }, res) => {
  let {
    messenger_user_id,
    new_promo_name: promo_name,
    new_promo_details: promo_details,
    new_promo_expiration_date: promo_expiration_date,
    new_promo_claim_limit: promo_claim_limit,
    new_promo_image_id: promo_image_id,
  } = query;
  
  let practice = await getPracticeByUserID(messenger_user_id);

  let practice_promos_base_id = practice.fields['Practice Promos Base ID'];

  let new_promo = await createNewPromo(
    { practice_promos_base_id, promo_name, promo_details, promo_expiration_date, promo_claim_limit, promo_image_id }
  );

  let redirect_to_blocks = ['New Custom Promo Created'];
  res.send({ redirect_to_blocks });
}

router.get(
  '/categories',
  handleRoute(sendCustomCategories, '[Error] Admin')
);

router.get(
  '/images',
  handleRoute(sendCustomImages, '[Error] Admin')
);

router.get(
  '/images/select',
  handleRoute(sendSelectedImage, '[Error] Admin')
);

router.get(
  '/update/date',
  handleRoute(updateExpirationDate, '[Error] Admin')
);

router.get(
  '/confirmed',
  handleRoute(createCustomPromo, '[Error] Admin')
);

module.exports = router;