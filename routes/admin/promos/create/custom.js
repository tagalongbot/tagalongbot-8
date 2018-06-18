let { getProviderByUserID } = require('../../../../libs/data/providers.js');
let { createNewPromo } = require('../../../../libs/admin/promos/create/custom/confirm.js');

let express = require('express');
let router = express.Router();

let sendProvider = async ({ query }, res) => {
  let { messenger_user_id } = query;

  let provider = await getProviderByUserID(messenger_user_id);
  let provider_id = provider.id;
  let provider_base_id = provider.fields['Practice Base ID'];

  let services = await getProviderServices({ provider });
  let services_with_promos = await getServicesWithPromos({ services });

  let galleryData = services_with_promos.map(
    toServicesGallery({ provider_id, provider_base_id })
  );

  let messages = createMultiGallery(galleryData);
  res.send({ messages });
}



let getCustomPromoImages = async ({ query }, res) => {
  
}

let createCustomPromo = async ({ query }, res) => {
  let { 
    messenger_user_id,
    new_promo_name,
    new_promo_image,
    new_promo_expiration_date,
    new_promo_claim_limit
  } = query;

  let provider = await getProviderByUserID(messenger_user_id);
  let provider_base_id = provider.fields['Practice Base ID'];

  let new_promo = await createNewPromo(
    { provider_base_id, new_promo_name, new_promo_image, new_promo_expiration_date, new_promo_claim_limit }    
  );

  let redirect_to_blocks = ['New Custom Promo Created'];
  res.send({ redirect_to_blocks });
}

router.get('/image', getCustomPromoImages);
router.get('/confirm', createCustomPromo);

module.exports = createCustomPromo;