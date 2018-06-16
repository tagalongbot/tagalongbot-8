let { createGallery, createMultiGallery } = require('../../../../libs/bots.js');
let { getProviderByUserID } = require('../../../../libs/providers.js');
let { findService } = require('../../../../libs/services.js');

let { getProviderServices, getServicePromos, getServicesWithPromos, createNewPromo, toServicesGallery, toPromosGallery } = require('../../../../libs/admin/promos/create/manufactured.js');

let express = require('express');
let router = express.Router();

let sendManufacturedServicesWithPromotions = async ({ query }, res) => {
  let { messenger_user_id } = query;

  let provider = await getProviderByUserID(messenger_user_id);
  let provider_id = provider.id;
  let provider_base_id = provider.fields['Practice Base ID'];

  let services = await getProviderServices({ provider });
  let services_with_promos = getServicesWithPromos({ services });

  let galleryData = services_with_promos.map(
    toServicesGallery({ provider_id, provider_base_id })
  );

  let messages = createMultiGallery(galleryData);
  res.send({ messages });
}

let sendServicePromos = async ({ query }, res) => {
  let { service_id, provider_id, provider_base_id } = query;

  let service = await findService(service_id);
  let promos = await getServicePromos(service);

  let galleryData = promos.map(
    toPromosGallery({ provider_id, provider_base_id }, service)
  );

  let gallery = createGallery(galleryData);
  let messages = [gallery];
  res.send({ messages });
}

let createServicePromo = async ({ query }, res) => {
  let { service_id, service_name, provider_id, provider_base_id, promo_type } = query;
  let new_promo_service_id = service_id;
  let new_promo_service_name = service_name
  let new_promo_provider_id = provider_id;
  let new_promo_provider_base_id = provider_base_id;
  let new_promo_type = promo_type;

  let set_attributes = { new_promo_service_id, new_promo_service_name, new_promo_provider_id, new_promo_provider_base_id, new_promo_type };
  let redirect_to_blocks = ['Create New Manufactured Promo'];
  res.send({ set_attributes, redirect_to_blocks });
}

let confirmCreateServicePromo = async ({ query }, res) => {
  let {
    // new_promo_provider_id, 
    new_promo_provider_base_id,
    new_promo_service_id, 
    new_promo_type,
    new_promo_expiration_date,
    new_promo_claim_limit,
  } = query;

  let data = { 
    new_promo_provider_base_id, 
    new_promo_service_id, 
    new_promo_type, 
    new_promo_expiration_date, 
    new_promo_claim_limit 
  };
  
  let newPromo = await createNewPromo(data);
  let redirect_to_blocks = ['New Manufactured Promo Created'];
  res.send({ redirect_to_blocks });
}

router.get('/', sendManufacturedServicesWithPromotions);
router.get('/service', sendServicePromos);
router.get('/service/create', createServicePromo);
router.get('/service/create/confirm', confirmCreateServicePromo);

module.exports = router;