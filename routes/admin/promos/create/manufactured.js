let handleRoute = require('../../../../middlewares/handleRoute.js');

let { createGallery, createMultiGallery } = require('../../../../libs/bots.js');
let { getProviderByUserID } = require('../../../../libs/data/providers.js');
let { getServiceByID, getAllServices, filterServicesFromProvider } = require('../../../../libs/data/services.js');
let { getManufacturedPromoByID, getManufacturedPromosByService } = require('../../../../libs/data/manufactured-promos.js');

let { getServicesWithPromos, createNewPromo, toServicesGallery, toPromosGallery } = require('../../../../libs/admin/promos/create/manufactured.js');

let express = require('express');
let router = express.Router();

let sendManufacturedServicesWithPromotions = async ({ query }, res) => {
  let { messenger_user_id } = query;

  let practice = await getProviderByUserID(messenger_user_id);
  let practice_id = practice.id;
  let provider_base_id = practice.fields['Practice Base ID'];

  let services = await getAllServices();
  let provider_services = filterServicesFromProvider({ services, practice });

  let services_with_promos = await getServicesWithPromos({ services: provider_services });

  let galleryData = services_with_promos.map(
    toServicesGallery({ practice_id, provider_base_id })
  );

  let txtMsg = { text: `Please pick a service to create a manufactured promo from?` };
  let messages = [txtMsg, ...createMultiGallery(galleryData)];
  res.send({ messages });
}

let sendServiceManufacturedPromos = async ({ query }, res) => {
  let { service_id, practice_id, provider_base_id } = query;

  let service = await getServiceByID({ service_id });
  let service_name = service.fields['Name'];
  let promos = await getManufacturedPromosByService({ service_name });

  let galleryData = promos.map(
    toPromosGallery({ service_id, practice_id, provider_base_id }, service)
  );

  let txtMsg = { text: `Which promo would you like to create for ${service_name}?` };
  let gallery = createGallery(galleryData);
  let messages = [txtMsg, gallery];
  res.send({ messages });
}

let createServicePromo = async ({ query }, res) => {
  let { service_id, promo_id, practice_id, provider_base_id } = query;

  let service = await getServiceByID({ service_id });
  let new_promo_service_name = service.fields['Name'];

  let promo = await getManufacturedPromoByID({ promo_id });
  let new_promo_type = promo.fields['Name'];

  let new_promo_id = promo_id;
  let new_promo_service_id = service_id;
  let new_promo_provider_id = practice_id;
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

router.get(
  '/',
  handleRoute(sendManufacturedServicesWithPromotions, '[Error] Getting Manufactured Promo Services')
);

router.get(
  '/service',
  handleRoute(sendServiceManufacturedPromos, '[Error] Getting Manufactured Service Promos')
);

router.get(
  '/service/create',
  handleRoute(createServicePromo, '[Error] Selecting Manufactured Promo')
);

router.get(
  '/service/create/confirm',
  handleRoute(confirmCreateServicePromo, '[Error] Creating Manufactured Promo')
);

module.exports = router;