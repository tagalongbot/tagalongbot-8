let { BASEURL, SERVICES_BASE_ID, SURGICAL_SERVICES_IMAGE_URL } = process.env;
let { createURL, shuffleArray } = require('../libs/helpers');
let { createGallery } = require('../libs/bots');

let { getTable, getAllDataFromTable } = require('../libs/data');

let getServicesTable = getTable('Services');
let servicesTable = getServicesTable(SERVICES_BASE_ID);
let getServicesFromTable = getAllDataFromTable(servicesTable);

let getServices = async () => {
  let view = 'Promotions';
  let services = await getServicesFromTable({ view });
  
  let services_promos = services.map((service) => {
    let keys = Object.keys(service).filter(key => key.toLowerCase().startsWith('promo-'));
    
  });

  return services_promos;
}

let sendManufacturedPromotions = async ({ query }, res) => {
  
}

module.exports = sendManufacturedPromotions;