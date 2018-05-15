let { BASEURL, SERVICES_BASE_ID, SURGICAL_SERVICES_IMAGE_URL } = process.env;
let { createURL, shuffleArray } = require('../libs/helpers');
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

let toGalleryElement = ({ fields: service }) => {
  let title = service['Name'];
  let subtitle = service['Long Description'].slice(0, 80);
  let image_url = service['Image URL'];
  
  let b
}

let sendManufacturedPromotions = async ({ query }, res) => {
  let services_promos = await getServices();
  // console.log(services_promos);

  let galleryData = services_promos.map(toGalleryElement);
  let gallery = createGallery(galleryData);
  let messages = [gallery];
  res.send({ messages });
}

module.exports = sendManufacturedPromotions;