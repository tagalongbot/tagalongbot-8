let { BASEURL } = process.env;
let { createURL, localizeDate } = require('../../libs/helpers.js');
let { createBtn } = require('../../libs/bots.js');
let { getTable, getAllDataFromTable } = require('../../libs/data.js');

let getPromosTable = getTable('Promos');

let filterPromosByService = ({ service_name, promos }) => {
  let service_name_lowercased = service_name.toLowerCase();

  let matching_promos = promos.filter(
    promo => promo.fields['Type'].toLowerCase().includes(service_name_lowercased)
  );

  return matching_promos;
}

let toGalleryElement = (data) => ({ id: promo_id, fields: promo }) => {
  let { practice_id, practice_promos_base_id, first_name, last_name, gender, messenger_user_id } = data;

  let promo_expiration_date = new Date(promo['Expiration Date']);

  let title = promo['Promotion Name'].slice(0, 80);
  let subtitle = `Valid Until ${localizeDate(promo_expiration_date)}`;
  let image_url = promo['Image URL'];

  let view_promo_details_url = createURL(
    `${BASEURL}/promos/details/unclaimed`,
    { practice_id, practice_promos_base_id, promo_id, first_name, last_name, gender, messenger_user_id }
  );

  let btn = createBtn(`View Promo Details|json_plugin_url|${view_promo_details_url}`);

  let buttons = [btn];

  let element = { title, subtitle, image_url, buttons};
  return element;
}

module.exports = {
  filterPromosByService,
  toGalleryElement,
}