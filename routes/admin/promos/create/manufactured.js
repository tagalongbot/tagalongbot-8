let handleRoute = require('../../../../middlewares/handleRoute.js');
let { localizeDate } = require('../../../../libs/helpers.js');
let { createExpirationDate } = require('../../../../libs/admin/promos/create.js');

let { createGallery, createMultiGallery } = require('../../../../libs/bots.js');

let { getPracticeByUserID } = require('../../../../libs/data/practices.js');
let { getServiceByID, getAllServices, filterServicesFromPractice } = require('../../../../libs/data/services.js');
let { getManufacturedPromoByID, getManufacturedPromosByService } = require('../../../../libs/data/manufactured-promos.js');

let { getServicesWithPromos, createNewPromo, toServicesGallery, toPromosGallery } = require('../../../../libs/admin/promos/create/manufactured.js');

let express = require('express');
let router = express.Router();

let sendManufacturedServicesWithPromotions = async ({ query }, res) => {
  let { messenger_user_id } = query;

  let practice = await getPracticeByUserID(messenger_user_id);

  let practice_id = practice.id;
  let practice_promos_base_id = practice.fields['Practice Promos Base ID'];

  let services = await getAllServices();

  let practice_services = filterServicesFromPractice(
    { services, practice }
  );

  let services_with_promos = await getServicesWithPromos(
    { services: practice_services }
  );

  let galleryData = services_with_promos.map(
    toServicesGallery({ practice_id, practice_promos_base_id })
  );

  let messages = [
    { text: `Please pick a service to create a manufactured promo from?` }, 
    ...createMultiGallery(galleryData)
  ];

  res.send({ messages });
}

let sendServiceManufacturedPromos = async ({ query }, res) => {
  let { service_id, practice_id, practice_promos_base_id } = query;

  let service = await getServiceByID(
    { service_id }
  );
  
  let service_name = service.fields['Name'];

  let promos = await getManufacturedPromosByService(
    { service_name }
  );

  let galleryData = promos.map(
    toPromosGallery({ service_id, practice_id, practice_promos_base_id }, service)
  );

  let messages = [
    { text: `Which promo would you like to create for ${service_name}?` }, 
    ...createMultiGallery(galleryData)
  ];

  res.send({ messages });
}

let createServicePromo = async ({ query }, res) => {
  let { service_id, promo_id, practice_id, practice_promos_base_id } = query;

  let service = await getServiceByID(
    { service_id }
  );
  
  let new_promo_service_name = service.fields['Name'];

  let promo = await getManufacturedPromoByID(
    { promo_id }
  );

  let new_promo_type = promo.fields['Name'];

  let new_promo_id = promo_id;
  let new_promo_service_id = service_id;
  let new_promo_practice_id = practice_id;
  let new_promo_practice_promos_base_id = practice_promos_base_id;

  let set_attributes = { 
    new_promo_id, 
    new_promo_service_id, 
    new_promo_service_name, 
    new_promo_type, 
    new_promo_practice_id, 
    new_promo_practice_promos_base_id 
  };

  let redirect_to_blocks = ['[ROUTER] New Manufactured Promo'];

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


let confirmCreateServicePromo = async ({ query }, res) => {
  let {
    new_promo_id: promo_id,
    new_promo_practice_promos_base_id: practice_promos_base_id,
    new_promo_service_id: service_id,
    new_promo_expiration_date: expiration_date,
    new_promo_claim_limit: claim_limit,
  } = query;

  let newPromo = await createNewPromo(
    { promo_id, practice_promos_base_id, service_id, expiration_date, claim_limit }
  );

  let redirect_to_blocks = ['New Manufactured Promo Created'];

  res.send({ redirect_to_blocks });
}

router.get(
  '/',
  handleRoute(sendManufacturedServicesWithPromotions, '[Error] Admin')
);

router.get(
  '/service',
  handleRoute(sendServiceManufacturedPromos, '[Error] Admin')
);

router.get(
  '/service/create',
  handleRoute(createServicePromo, '[Error] Admin')
);

router.get(
  '/update/date',
  handleRoute(updateExpirationDate, '[Error] Admin')
);

router.get(
  '/service/create/confirmed',
  handleRoute(confirmCreateServicePromo, '[Error] Admin')
);

module.exports = router;