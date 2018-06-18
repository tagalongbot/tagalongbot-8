let { createMultiGallery } = require('../../../../libs/bots.js');
let { getProviderByUserID } = require('../../../../libs/data/providers.js');
let { findService, getAllServices, filterServicesFromProvider } = require('../../../../libs/data/services.js');
let { toCategoryGallery, toImagesGallery } = require('../../../../libs/admin/promos/create/custom.js');
let { getCustomPromosByService, getCustomPromoByID } = require('../../../../libs/data/custom-promos.js');
let { createNewPromo } = require('../../../../libs/admin/promos/create/custom/confirm.js');

let express = require('express');
let router = express.Router();

let sendProviderServices = async ({ query }, res) => {
  let { messenger_user_id, new_promo_name, new_promo_expiration_date, new_promo_claim_limit } = query;

  let custom_promos = 
  let custom_promo_categories
  
  let galleryData = custom_promo_categories.map(
    toCategoryGallery({ messenger_user_id, new_promo_name, new_promo_expiration_date, new_promo_claim_limit })
  );

  let messages = createMultiGallery(galleryData);
  res.send({ messages });
}

let sendCustomImages = async ({ query }, res) => {
  let { messenger_user_id, service_id, new_promo_name, new_promo_expiration_date, new_promo_claim_limit } = query;

  let service = await findService(service_id);
  let service_name = service.fields['Name'];
  let custom_promos = await getCustomPromosByService({ service_name });

  let galleryData = custom_promos.map(
    toImagesGallery({ new_promo_name, new_promo_expiration_date, new_promo_claim_limit })
  );

  let messages = createMultiGallery(galleryData);
  res.send({ messages });
}

let sendSelectedImage = async ({ query }, res) => {
  let { new_promo_name, new_promo_expiration_date, new_promo_claim_limit, new_promo_image_id } = query;
  let set_attributes = { new_promo_image_id };
  let redirect_to_blocks = ['New Custom Promotion Confirmation'];
  res.send({ set_attributes, redirect_to_blocks });
}

let createCustomPromo = async ({ query }, res) => {
  let { 
    messenger_user_id,
    new_promo_name,
    new_promo_image_id,
    new_promo_expiration_date,
    new_promo_claim_limit
  } = query;

  let provider = await getProviderByUserID(messenger_user_id);
  let provider_base_id = provider.fields['Practice Base ID'];

  let new_promo = await createNewPromo(
    { provider_base_id, new_promo_name, new_promo_image_id, new_promo_expiration_date, new_promo_claim_limit }    
  );

  let redirect_to_blocks = ['New Custom Promo Created'];
  res.send({ redirect_to_blocks });
}

router.get('/services', sendProviderServices);
router.get('/images', sendCustomImages);
router.get('/images/select', sendSelectedImage);
router.get('/confirm', createCustomPromo);

module.exports = router;