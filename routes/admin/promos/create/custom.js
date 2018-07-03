let handleRoute = require('../../../../middlewares/handleRoute.js');

let { getPracticeByUserID } = require('../../../../libs/data/practices.js');
let { getCustomCategoryByID } = require('../../../../libs/data/custom-images.js');
let { getCustomCategories, getCustomImagesByCategory } = require('../../../../libs/data/custom-images.js');

let { createNewPromo } = require('../../../../libs/admin/promos/create/custom/confirm.js');

let { toCategoryGallery, toImagesGallery } = require('../../../../libs/admin/promos/create/custom.js');
let { createMultiGallery } = require('../../../../libs/bots.js');

let express = require('express');
let router = express.Router();

let sendCustomCategories = async ({ query }, res) => {
  // console.log('query', query);
  let { 
    messenger_user_id,
    new_promo_name: promo_name,
    new_promo_expiration_date: expiration_date,
    new_promo_claim_limit: claim_limit,
  } = query;

  let custom_promo_categories = await getCustomCategories();

  let galleryData = custom_promo_categories.map(
    toCategoryGallery({ messenger_user_id, promo_name, expiration_date, claim_limit })
  );

  // console.log('Category Gallery Button', galleryData[0].buttons[0]);

  let txtMsg = { text: `Please choose an image category from below` };
  let messages = [txtMsg, ...createMultiGallery(galleryData)];
  res.send({ messages });
}

let sendCustomImages = async ({ query, url }, res) => {
  let { 
    messenger_user_id, 
    category_id, new_promo_name: 
    promo_name, new_promo_expiration_date: 
    promo_expiration_date, new_promo_claim_limit: 
    promo_claim_limit
  } = query;

  // console.log('query', query);
  // console.log('url', url);
  // console.log('new_promo_name', new_promo_name);

  let category = await getCustomCategoryByID({ category_id });
  let category_name = category.fields['Category Name'];
  let custom_promo_images = await getCustomImagesByCategory({ category_name });

  let galleryData = custom_promo_images.map(
    toImagesGallery({ promo_name, promo_expiration_date, promo_claim_limit })
  );

  // console.log('Gallery Image Element', galleryData[0]);

  let txtMsg = { text: `Please choose an image below from ${category_name} to use for your new custom promo` };
  let messages = [txtMsg, ...createMultiGallery(galleryData)];
  res.send({ messages });
}

let sendSelectedImage = async ({ query }, res) => {
  let { new_promo_image_id } = query;

  let set_attributes = { new_promo_image_id };
  let redirect_to_blocks = ['New Custom Promotion Confirmation'];

  res.send({ set_attributes, redirect_to_blocks });
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
  let practice_base_id = practice.fields['Practice Base ID'];

  let new_promo = await createNewPromo(
    { practice_base_id, promo_name, promo_details, promo_expiration_date, promo_claim_limit, promo_image_id }
  );

  let redirect_to_blocks = ['New Custom Promo Created'];
  res.send({ redirect_to_blocks });
}

router.get(
  '/categories',
  handleRoute(sendCustomCategories, '[Error] Getting Custom Promo Image Categories')
);

router.get(
  '/images',
  handleRoute(sendCustomImages, '[Error] Getting Custom Promo Category Images')
);

router.get(
  '/images/select',
  handleRoute(sendSelectedImage, '[Error] Selecting Image')
);

router.get(
  '/confirm',
  handleRoute(createCustomPromo, '[Error] Creating Custom Promo')
);

module.exports = router;