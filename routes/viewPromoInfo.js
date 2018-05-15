let { BASEURL } = process.env;
let { createURL, localizeDate } = require('../libs/helpers');
let { createGallery, createMultiGallery } = require('../libs/bots');
let { getProviderByUserID } = require('../libs/providers');

let { getTable, getAllDataFromTable, findTableData, createTableData, updateTableData } = require('../libs/data');

let getPromosTable = getTable('Promos');

let toGalleryData = ({ provider_base_id }) => ({ id: promo_id, fields: promo }) => {
  let title = promo['Promotion Name'];
  let subtitle = promo['Terms'];
  let image_url = promo['Image URL'];

  let view_promo_details_url = createURL(`${BASEURL}/promo/view/info`, { promo_id, provider_base_id });
  let update_promo_url = createURL(`${BASEURL}/promo/update`, { promo_id, provider_base_id });
  let toggle_promo_url = createURL(`${BASEURL}/promo/toggle`, { promo_id, provider_base_id });

  let btn1 = {
    title: 'View Promo Details',
    type: 'json_plugin_url',
    url: view_promo_details_url
  }

  let btn2 = {
    title: 'Update Promo',
    type: 'json_plugin_url',
    url: update_promo_url
  }

  let btn3 = {
    title: promo['Active?'] ? 'Deactivate' : 'Reactivate',
    type: 'json_plugin_url',
    url: toggle_promo_url
  }

  let buttons = [btn1, btn2, btn3];

  let element = { title, subtitle, image_url, buttons }
  return element;
}

let createPromoMsg = (promo) => {
  let msg = ``;
}

let viewPromoInfo = async ({ query }, res) => {
  let { promo_id, provider_base_id } = query;
  let messenger_user_id = query['messenger user id'];
  let provider = await getProviderByUserID(messenger_user_id);

  let promosTable = getPromosTable(provider_base_id);
  let findPromo = findTableData(promosTable);

  let promo = await findPromo(promo_id);

  let promoMsg = createPromoMsg(promo);

  let messages = [promoMsg];
  res.send({ messages });
}

module.exports = viewPromoInfo;