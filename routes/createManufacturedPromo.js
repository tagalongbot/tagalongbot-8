let { BASEURL, SERVICES_BASE_ID, SURGICAL_SERVICES_IMAGE_URL } = process.env;
let { createURL } = require('../libs/helpers');
let { createGallery, createMultiGallery } = require('../libs/bots');
let { getProviderByUserID } = require('../libs/providers');

let { getTable, getAllDataFromTable, findTableData, updateTableData } = require('../libs/data');

let getServicesTable = getTable('Services');
let servicesTable = getServicesTable(SERVICES_BASE_ID);
let getServicesFromTable = getAllDataFromTable(servicesTable);
let findService = findTableData(servicesTable);

let express = require('express');
let router = express.Router();

let getServices = async () => {
  let view = 'Main View';
  let services = await getServicesFromTable({ view });
  return services;
}

let getServicePromosCount = (service) => {
  return Object.keys(service).filter(key => key.toLowerCase().startsWith('promo-')).length;
}

let toServicesGallery = ({ provider_id, provider_base_id }) => ({ id: service_id, fields: service }) => {
  let title = service['Name'];

  let service_types_length = getServicePromosCount(service);
  let subtitle = `${service_types_length} types of promos`;
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
  let provider = await getProviderByUserID(messenger_user_id, ['Provider Base ID']);
  let provider_base_id = provider.fields['Practice Base ID'];
  let provider_id = provider.id;

  let services_promos = await getServices();

  let services_with_promos = services_promos.filter((service) => {
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
  let title = promo_name;
  let image_url = service[promo_name];

  let create_promo_url = createURL(`${BASEURL}/promo/new/manufactured/service/create`, { service_id, provider_id, provider_base_id });

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
  let { service_id, provider_id, provider_base_id } = query;
  
  
}

router.get('/', sendManufacturedPromotions);
router.get('/service', sendServicePromos);
router.get('/service/create', createServicePromo);

module.exports = router;