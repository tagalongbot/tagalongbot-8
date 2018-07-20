let handleRoute = require('../../../middlewares/handleRoute.js');

let { getPracticePromo } = require('../../../libs/data/practice/promos.js');
let { createExpirationDate } = require('../../../libs/admin/promos/create.js');
let { localizeDate } = require('../../../libs/helpers.js');
let { createMultiGallery } = require('../../../libs/bots.js');

let { getCustomCategories, getCustomCategoryByID, getCustomImagesByCategory, getCustomImageByID } = require('../../../libs/data/custom-images.js');

let { toCategoriesGallery, toImagesGallery, updatePromo, createUpdateMsg } = require('../../../libs/admin/promos/update.js');

let express = require('express');
let router = express.Router();

let getUpdateField = async ({ query }, res) => {
  let { promo_id, practice_promos_base_id } = query;

  let updating_promo_id = promo_id;
  let updating_practice_promos_base_id = practice_promos_base_id;

  let set_attributes = { updating_promo_id, updating_practice_promos_base_id };
  let redirect_to_blocks = ['Update Promo'];
  res.send({ set_attributes, redirect_to_blocks });
}

let updateExpirationDate = async ({ query }, res) => {
  let { update_promo_field_value } = query;

  let new_value = localizeDate(
    createExpirationDate(update_promo_field_value)
  );
  
  let set_attributes = { update_promo_field_value: new_value }
  res.send({ set_attributes });
}

let getImageCategories = async ({ query }, res) => {
  let { promo_id, practice_promos_base_id } = query;
  let categories = await getCustomCategories();

  let gallery_data = categories.map(
    toCategoriesGallery({ promo_id, practice_promos_base_id })
  );

  let galleries = createMultiGallery(gallery_data);

  let txtMsg = { text: `Please choose an image category from below` };

  let messages = [txtMsg, ...galleries];
  res.send({ messages });
}

let getImagesFromCategory = async ({ query }, res) => {
  let { promo_id, practice_promos_base_id, category_id } = query;

  let promo = await getPracticePromo({ promo_id, practice_promos_base_id });

  let category = await getCustomCategoryByID({ category_id });
  let category_name = category.fields['Category Name'];

  let images = await getCustomImagesByCategory({ category_name });

  let gallery_data = images.map(
    toImagesGallery(promo)
  );

  let galleries = createMultiGallery(gallery_data);

  let txtMsg = { text: `Please choose an image below to use for ${promo.fields['Promotion Name']}` };
  let messages = [txtMsg, ...galleries];
  res.send({ messages });
}

let selectUpdateImage = async ({ query }, res) => {
  let { custom_image_id } = query;

  let image_promo = await getCustomImageByID({ custom_image_id });
  let image_url = image_promo.fields['Image URL'];

  let set_attributes = { update_promo_field_value: image_url }
  let redirect_to_blocks = ['Update Promo (JSON)'];
  res.send({ set_attributes, redirect_to_blocks });
}

let updatePromoInfo = async ({ query }, res) => {
  let {
    messenger_user_id,
    updating_promo_id,
    updating_practice_promos_base_id,
    update_promo_field_name, 
    update_promo_field_value 
  } = query;

  let promo_id = updating_promo_id;
  let practice_promos_base_id = updating_practice_promos_base_id;

  let promo = await getPracticePromo({ practice_promos_base_id, promo_id });

  let updatedPromo = await updatePromo(
    { practice_promos_base_id, promo, update_promo_field_name, update_promo_field_value }
  );

  let updateMsg = createUpdateMsg(
    { messenger_user_id, promo_id, practice_promos_base_id, promo, updatedPromo, update_promo_field_name, update_promo_field_value }
  );

  let messages = [updateMsg];
  res.send({ messages });
}

router.get(
  '/', // Gets field to update from user
  handleRoute(getUpdateField, '[Error] Admin')
);

router.get(
  '/expiration_date',
  handleRoute(updateExpirationDate, '[Error] Admin')
);

router.get(
  '/image_categories',
  handleRoute(getImageCategories, '[Error] Admin')
);

router.get(
  '/images',
  handleRoute(getImagesFromCategory, '[Error] Admin')
);

router.get(
  '/image/select',
  handleRoute(selectUpdateImage, '[Error] Admin')
);

router.get(
  '/field', // Updates the promo field
  handleRoute(updatePromoInfo, '[Error] Admin')
);

module.exports = router;