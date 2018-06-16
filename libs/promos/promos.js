let { BASEURL } = process.env;
let { createURL } = require('../../libs/helpers.js');
let { getTable, getAllDataFromTable } = require('../../libs/data.js');
let { searchProviders } = require('../../libs/providers.js');

let getPromosTable = getTable('Promos');

let getProviders = async ({ search_promos_state, search_promos_city, search_promos_zip_code, search_type }) => {
  let search_providers_state = search_promos_state;
  let search_providers_city = search_promos_city;
  let search_providers_zip_code = search_promos_zip_code;

  let providers = await searchProviders(
    { search_type, active: true },
    { search_providers_state, search_providers_city, search_providers_zip_code }
  );

  return providers;
}

let filterPromosByService = ({ service_name, promos }) => {
  let service_name_lowercased = service_name.toLowerCase();

  let matching_promos = promos.filter(
    promo => promo.fields['Type'].toLowerCase().includes(service_name_lowercased)
  );

  return matching_promos;
}

let toGalleryElement = (data) => ({ id: promo_id, fields: promo }) => {
  let title = promo['Promotion Name'].slice(0, 80);
  let subtitle = promo['Terms'];
  let image_url = promo['Image URL'];

  let promo_type = encodeURIComponent(promo['Type']);

  // Bug with Sending "gender" to json_plugin_url button
  let btn1URL = createURL(
    `${BASEURL}/promos/details`, 
    data
  );

  let btn1 = {
    title: 'View Promo Details',
    type: 'json_plugin_url',
    url: btn1URL,
  }

  let buttons = [btn1];

  let element = { title, subtitle, image_url, buttons};
  return element;
}

module.exports = {
  getProviders,
  filterPromosByService,
  toGalleryElement,
}