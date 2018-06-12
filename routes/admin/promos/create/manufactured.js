let { BASEURL, SERVICES_BASE_ID, SURGICAL_SERVICES_IMAGE_URL } = process.env;
let { createURL, localizeDate } = require('../libs/helpers');
let { createGallery, createMultiGallery } = require('../libs/bots');
let { getProviderByUserID } = require('../libs/providers');

let { getTable, getAllDataFromTable, findTableData, createTableData, updateTableData } = require('../libs/data');

let getServicesTable = getTable('Services');
let servicesTable = getServicesTable(SERVICES_BASE_ID);
let getServicesFromTable = getAllDataFromTable(servicesTable);
let findService = findTableData(servicesTable);

let getPromosTable = getTable('Promos');

let express = require('express');
let router = express.Router();

let sendManufacturedPromotions = async ({ query }, res) => {
  let messenger_user_id = query['messenger user id'];
  let provider = await getProviderByUserID(messenger_user_id, ['Practice Base ID', 'Practice Services']);
  let provider_id = provider.id;
  let provider_base_id = provider.fields['Practice Base ID'];

  let provider_services = await getProviderServices(provider);
  let services_with_promos = getServicesWithPromos(provider_services);

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

  let galleryData = promos.map(toPromosGallery({ provider_id, provider_base_id }, service));
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

let createNewPromo = async (data) => {
  let { new_promo_provider_base_id, new_promo_service_id, new_promo_type, new_promo_expiration_date, new_promo_claim_limit } = data;
  let promosTable = getPromosTable(new_promo_provider_base_id);
  let createPromo = createTableData(promosTable);

  let service = await findService(new_promo_service_id);

  let new_promo_image = service.fields[`Promo-${new_promo_type}`];

  let expiration_date = new Date(new_promo_expiration_date);

  let promoData = {
    ['Promotion Name']: `${new_promo_type} on ${service.fields['Name']}`,
    ['Type']: `${service.fields['Name']}-${new_promo_type.trim().toLowerCase()}`,
    ['Active?']: true,
    ['Terms']: `Valid Until ${localizeDate(expiration_date)}`,
    ['Expiration Date']: expiration_date,
    ['Image URL']: new_promo_image,
    ['Claim Limit']: Number(new_promo_claim_limit.trim()),
    ['Total Claim Count']: 0,
    ['Total Used']: 0,
  }

  let newPromo = await createPromo(promoData);
  
  return newPromo;
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

router.get('/', sendManufacturedPromotions);
router.get('/service', sendServicePromos);
router.get('/service/create', createServicePromo);
router.get('/service/create/confirm', confirmCreateServicePromo);

module.exports = router;