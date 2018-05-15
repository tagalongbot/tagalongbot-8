let { BASEURL, SERVICES_BASE_ID, SURGICAL_SERVICES_IMAGE_URL } = process.env;
let { createURL } = require('../libs/helpers');
let { createGallery } = require('../libs/bots');

let { getTable, getAllDataFromTable } = require('../libs/data');

let getServicesTable = getTable('Services');
let servicesTable = getServicesTable(SERVICES_BASE_ID);
let getServicesFromTable = getAllDataFromTable(servicesTable);

// let getServices = async () => {
//   let view = 'Promotions';
//   let services = await getServicesFromTable({ view });
  
//   let services_promos = services.map((service) => {
//     return Object.keys(service.fields).reduce((obj, key) => {
//       if (key.toLowerCase().startsWith('promo-')) obj[key] = service.fields[key];
//       return { id: service.id, ...obj };
//     }, {});
//   });

//   return services_promos;
// }

let getServices = async () => {
  let view = 'Main View';
  let services = await getServicesFromTable({ view });
  return services;
}

let toGalleryElement = ({ id: service_id, fields: service }) => {
  let title = service['Name'];

  let service_types_length = Object.keys(service).filter(key => key.toLowerCase().startsWith('promo-')).length;
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
  // console.log(services_promos);

  let galleryData = services_promos.map(toGalleryElement).slice(0,1);
  let gallery = createGallery(galleryData);
  let messages = [gallery];
  res.send({ messages });
}

module.exports = sendManufacturedPromotions;