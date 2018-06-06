let { toGalleryElement } = require('../libs/promos');
let { createMultiGallery } = require('../libs/bots');
let { getTable, getAllDataFromTable } = require('../libs/data');

let getPromosTable = getTable('Promos');

let getPromos = async ({ service_name, provider_base_id }) => {
  let promosTable = getPromosTable(provider_base_id);
  let view = 'Active Promos';
  let promos = await getAllDataFromTable({ view });
  let matched_promos = promos.filter(
    promo => promo.fields['Type'].toLowerCase().includes(service_name)
  );

  return matched_promos;
}

let getServiceProviderPromos = async ({ query }, res) => {
  let { service_name, provider_base_id } = query;

  let promos = await getPromos({ service_name, provider_base_id });
  let galleryData = promos.map(toGalleryElement({ provider_base_id }));
  let messages = createMultiGallery(galleryData);
  res.send({ messages });
}

module.exports = getServiceProviderPromos;