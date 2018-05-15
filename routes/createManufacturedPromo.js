let { BASEURL, SERVICES_BASE_ID, SURGICAL_SERVICES_IMAGE_URL } = process.env;
let { createURL } = require('../libs/helpers');
let { createGallery, createMultiGallery } = require('../libs/bots');

let { getTable, getAllDataFromTable, findTableData } = require('../libs/data');

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

let toServicesGallery = ({ id: service_id, fields: service }) => {
  let title = service['Name'];
  
  let service_types_length = getServicePromosCount(service);
  let subtitle = `${service_types_length} types of promos`;
  let image_url = service['Image URL'];

  let view_service_promos_url = createURL(`${BASEURL}/promo/new/manufactured/service`, { service_id });

  let btn1 = {
    title: 'View Service Promos',
    type: 'json_plugin_url',
    url: view_service_promos_url
  }

  let buttons = [btn1];

  let element = { title, subtitle, image_url, buttons };
  return element;
}

let sendManufacturedPromotions = async ({ query }, res) => {
  let services_promos = await getServices();

  let services_with_promos = services_promos.filter((service) => {
    let promos_count = getServicePromosCount(service.fields);
    return promos_count > 0;
  });

  let galleryData = services_with_promos.map(toServicesGallery);
  let messages = createMultiGallery(galleryData);
  res.send({ messages });
}

let getServicePromos = async () => {
  let view = 'Promotions';
  let services = await getServicesFromTable({ view });

  let services_promos = services.map((service) => {
    return Object.keys(service.fields).reduce((obj, key) => {
      if (key.toLowerCase().startsWith('promo-')) obj[key] = service.fields[key];
      return { id: service.id, ...obj };
    }, {});
  });

  return services_promos;
}

let toPromosGallery = (service) => (promo_name) => {
  
}

let sendServicePromos = async ({ query }, res) => {
  let service = await findService(query.service_id);
  let promos = await getServicePromos(service);
  
  let galleryData = c
  
}

router.get('/', sendManufacturedPromotions);
router.get('/service', sendServicePromos);

module.exports = router;