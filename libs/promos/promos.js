let { localizeDate } = require('../../libs/helpers.js');
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
  let { practice_id, practice_promos_base_id } = data;

  let promo_expiration_date = new Date(promo['Expiration Date']);

  let title = promo['Promotion Name'].slice(0, 80);
  let subtitle = `Valid Until ${localizeDate(promo_expiration_date)}`;
  let image_url = promo['Image URL'];

  let view_promo_details_url = createBtn(
    `View Promo Details|show_block|[JSON] View Promo Details (Unclaimed)`,
    { practice_id, practice_promos_base_id, promo_id }
  );

  let buttons = [view_promo_details_url];

  return { title, subtitle, image_url, buttons };
}

module.exports = {
  filterPromosByService,
  toGalleryElement,
}