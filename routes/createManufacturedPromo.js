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

let getProviderServices = async (provider) => {
  let view = 'Main View';
  let services = await getServicesFromTable({ view });

  let provider_services = provider.fields['Practice Services'].map(service => service.toLowerCase());

  let matched_services = services.filter(
    (service) => provider_services.includes(service.fields['Name'].toLowerCase())
  );

  return matched_services;
}

let getServicePromosCount = (service) => {
  return Object.keys(service).filter(key => key.toLowerCase().startsWith('promo-')).length;
}

let toServicesGallery = ({ provider_id, provider_base_id }) => ({ id: service_id, fields: service }) => {
  let title = service['Name'];

  let service_types_length = getServicePromosCount(service);
  let subtitle = `Promo Types Available: ${service_types_length}`;
  let image_url = service['Image URL'];

  let view_service_promos_url = createURL(`${BASEURL}/promo/new/manufactured/service`, { service_id, provider_id, provider_base_id });

  let btn = {
    title: 'View Service Promos',
    type: 'json_plugin_url',
    url: view_service_promos_url
  }

  let buttons = [btn];

  let element = { title, subtitle, image_url, buttons };
  return element;
}

let sendManufacturedPromotions = async ({ query }, res) => {
  let messenger_user_id = query['messenger user id'];
  let provider = await getProviderByUserID(messenger_user_id, ['Practice Base ID', 'Practice Services']);
  let provider_base_id = provider.fields['Practice Base ID'];
  let provider_id = provider.id;

  let provider_services = await getProviderServices(provider);

  let services_with_promos = provider_services.filter((service) => {
    let promos_count = getServicePromosCount(service.fields);
    return promos_count > 0;
  });

  let galleryData = services_with_promos.map(toServicesGallery({ provider_id, provider_base_id }));
  let messages = createMultiGallery(galleryData);
  res.send({ messages });
}

let getServicePromos = (service) => {
  let promos = Object.keys(service.fields)

  .filter(
    (key) => key.toLowerCase().startsWith('promo-')
  );

  return promos;
}

let toPromosGallery = ({ provider_id, provider_base_id }, { id: service_id, fields: service }) => (promo_name) => {
  let promo_type = promo_name.slice(6);
  let title = promo_type;
  let image_url = service[promo_name];
  
  let service_name = service['Name'];  
  let create_promo_url = createURL(`${BASEURL}/promo/new/manufactured/service/create`, { service_id, service_name, provider_id, provider_base_id, promo_type });

  let btn = {
    title: 'Create Promo',
    type: 'json_plugin_url',
    url: create_promo_url
  }

  let buttons = [btn];

  let element = { title, image_url, buttons };
  return element;
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

let confirmCreateServicePromo = async ({ query }, res) => {
  let { new_promo_service_id, new_promo_provider_id, new_promo_provider_base_id, new_promo_type } = query;
  let { new_promo_expiration_date, new_promo_claim_limit } = query;

  let promosTable = getPromosTable(new_promo_provider_base_id);
  let createPromo = createTableData(promosTable);

  let service = await findService(new_promo_service_id);

  let new_promo_image = service.fields[`Promo-${new_promo_type}`];

  let expiration_date = new Date(new_promo_expiration_date);

  let promoData = {
    ['Promotion Name']: `${new_promo_type} on ${service.fields['Name']}`,
    ['Type']: `${service.fields['Name']}-${new_promo_type.trim().toLowerCase()}`,
    ['Active?']: true,
    ['Terms']: `Valid Until ${localizeDate(new_promo_expiration_date)}`,
    ['Expiration Date']: expiration_date,
    ['Image URL']: new_promo_image,
    ['Claim Limit']: Number(new_promo_claim_limit.trim()),
    ['Total Claim Count']: 0,
  }

  let newPromo = await createPromo(promoData);
  let redirect_to_blocks = ['New Manufactured Promo Created'];
  res.send({ redirect_to_blocks });
}

router.get('/', sendManufacturedPromotions);
router.get('/service', sendServicePromos);
router.get('/service/create', createServicePromo);
router.get('/service/create/confirm', confirmCreateServicePromo);

module.exports = router;