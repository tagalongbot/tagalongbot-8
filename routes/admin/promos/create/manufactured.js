let { createGallery, createMultiGallery } = require('../../../../libs/bots.js');
let { getProviderByUserID } = require('../../../../libs/data/providers.js');
let { findService } = require('../../../../libs/data/services.js');
let { getManufacturedPromoByID, getManufacturedPromosByService } = require('../../../../libs/data/manufactured-promos.js');

let { getProviderServices, getServicesWithPromos, createNewPromo, toServicesGallery, toPromosGallery } = require('../../../../libs/admin/promos/create/manufactured.js');

let express = require('express');
let router = express.Router();

let sendManufacturedServicesWithPromotions = async ({ query }, res) => {
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

let sendServiceManufacturedPromos = async ({ query }, res) => {
  let { service_id, provider_id, provider_base_id } = query;

  let service = await findService(service_id);
  let service_name = service.fields['Name'];
  let promos = await getManufacturedPromosByService({ service_name });

  let galleryData = promos.map(
    toPromosGallery({ service_id, provider_id, provider_base_id }, service)
  );

  let gallery = createGallery(galleryData);
  let messages = [gallery];
  res.send({ messages });
}

let createServicePromo = async ({ query }, res) => {
  let { service_id, promo_id, provider_id, provider_base_id } = query;

  let service = await findService(service_id);
  let new_promo_service_name = service.fields['Name'];

  let promo = await getManufacturedPromoByID({ promo_id });
  let new_promo_type = promo.fields['Name'];

  let new_promo_id = promo_id;
  let new_promo_service_id = service_id;
  let new_promo_provider_id = provider_id;
  let new_promo_provider_base_id = provider_base_id;

  let set_attributes = { new_promo_id, new_promo_service_id, new_promo_service_name, new_promo_type, new_promo_provider_id, new_promo_provider_base_id };
  let redirect_to_blocks = ['Create New Manufactured Promo'];
  res.send({ set_attributes, redirect_to_blocks });
}

let confirmCreateServicePromo = async ({ query }, res) => {
  let {
    // new_promo_provider_id,
    new_promo_id,
    new_promo_provider_base_id,
    new_promo_service_id,
    new_promo_expiration_date,
    new_promo_claim_limit,
  } = query;

  let newPromo = await createNewPromo(
    { new_promo_id, new_promo_provider_base_id, new_promo_service_id, new_promo_expiration_date, new_promo_claim_limit }
  );

  let redirect_to_blocks = ['New Manufactured Promo Created'];
  res.send({ redirect_to_blocks });
}

router.get('/', sendManufacturedServicesWithPromotions);
router.get('/service', sendServiceManufacturedPromos);
router.get('/service/create', createServicePromo);
router.get('/service/create/confirm', confirmCreateServicePromo);

module.exports = router;