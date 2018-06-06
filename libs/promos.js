let { BASEURL } = process.env;
let { createURL } = require('../libs/helpers');
let { searchProviders, filterProvidersByService } = require('../libs/providers');
let { getTable, getAllDataFromTable } = require('../libs/data');

let getPromosTable = getTable('Promos');

let searchPromotionsByLocation = async (data, { search_type, service_name }) => {
  // Needs to be updated to use promotion expiration date
	let { search_promos_state, search_promos_city, search_promos_zip_code, search_promo_code } = data;

  let providers = await searchProviders({
    search_providers_state: search_promos_state,
    search_providers_city: search_promos_city,
    search_providers_zip_code: search_promos_zip_code,
  }, { search_type, active: true });

  if (service_name) providers = filterProvidersByService(service_name, providers);

  let providersBaseIDs = providers.map((provider) => provider.fields['Practice Base ID']);

  let promotions = [];
  let view = 'Active Promos';

  for (let [index, baseID] of providersBaseIDs.entries()) {
    if (!baseID) continue;
    let promosTable = getPromosTable(baseID);
    let getPromos = getAllDataFromTable(promosTable);
    let promos = await getPromos({ view });

    if (service_name) promos = promos.filter(promo => promo.fields['Type'].toLowerCase().includes(service_name.toLowerCase()));
    let provider_id = providers[index].id;
    let provider_base_id = providersBaseIDs[index];
    promotions = promotions.concat({ provider_id, provider_base_id, promos });
  }

  return promotions;
}

let toGalleryElement = ({ provider_id, provider_base_id, first_name, last_name, gender, messenger_user_id }) => ({ id: promo_id, fields: promo }) => {
  let title = promo['Promotion Name'].slice(0, 80);
  let subtitle = promo['Terms'];
  let image_url = promo['Image'][0].url;

  let promo_type = encodeURIComponent(promo['Type']);

  // Bug with Sending "gender" to json_plugin_url button
  let data = { provider_id, provider_base_id, promo_id, first_name, last_name, gender1: gender, messenger_user_id };
  let btn1URL = createURL(`${BASEURL}/promo/details`, data);

  let btn1 = {
    title: 'View Promo Details',
    type: 'json_plugin_url',
    url: btn1URL,
  }

  let buttons = [btn1];

  let element = { title, subtitle, image_url, buttons};
  return element;
}

let toGalleryData = ({ first_name, last_name, gender, messenger_user_id }) => (arr, { provider_id, provider_base_id, promos }) => {
  return arr.concat(
    ...promos.map(
      toGalleryElement({ provider_id, provider_base_id, first_name, last_name, gender, messenger_user_id })
    )
  );
}

module.exports = {
  searchPromotionsByLocation,
  toGalleryElement,
  toGalleryData,
}