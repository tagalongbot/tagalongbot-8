let { BASEURL } = process.env;
let { createURL } = require('../libs/helpers');
let { searchProviders, filterProvidersByService } = require('../libs/providers');
let { getTable, getAllDataFromTable } = require('../libs/data');

let getPromosTable = getTable('Promos');

let toGalleryElement = ({ provider_id, provider_base_id, first_name, last_name, gender, messenger_user_id }) => ({ id: promo_id, fields: promo }) => {
  let title = promo['Promotion Name'].slice(0, 80);
  let subtitle = promo['Terms'];
  let image_url = promo['Image URL'];

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