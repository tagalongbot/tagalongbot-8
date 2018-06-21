let { BASEURL } = process.env;
let { createURL, localizeDate } = require('../../libs/helpers.js');
let { createBtn } = require('../../libs/bots.js');
let { getTable, getAllDataFromTable } = require('../../libs/data.js');
let { searchProviders } = require('../../libs/data/providers.js');

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
  let { provider_id, provider_base_id, first_name, last_name, gender, messenger_user_id } = data;

  let promo_expiration_date = new Date(promo['Expiration Date']);
 
  let title = promo['Promotion Name'].slice(0, 80);
  let subtitle = `Valid Until ${localizeDate(promo_expiration_date)}`;
  let image_url = promo['Image URL'];

  let claimed_users = promo['Claimed '];
  
  
  let view_promo_details_url = createURL(
    `${BASEURL}/promos/details/unclaimed`,
    { provider_id, provider_base_id, promo_id, first_name, last_name, gender, messenger_user_id }
  );

  let btn = createBtn(`View Promo Details|json_plugin_url|${view_promo_details_url}`);

  let buttons = [btn];

  let element = { title, subtitle, image_url, buttons};
  return element;
}

module.exports = {
  getProviders,
  filterPromosByService,
  toGalleryElement,
}