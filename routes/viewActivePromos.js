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
  
  let view_promo_details_url = createURL();
  
  let btn1 = {
    title: 'View Promo Details',
    type: 'json_plugin_url',
    url: view_promo_details_url
  }
  
  let btn2 = {
    title: 'Update Pr
  }
}

let viewActivePromos = async ({ query }, res) => {
  let messenger_user_id = query['messenger user id'];
  let provider = await getProviderByUserID(messenger_user_id);

  let provider_base_id = provider.fields['Practice Base ID'];
  let promosTable = getPromosTable(provider_base_id);
  let getPromos = getAllDataFromTable(promosTable);

  let view = 'Promotions';
  let filterByFormula = `{Active?}`;
  
  let promos = await getPromos({ filterByFormula });
  
  let galleryData = promos.map(toGalleryData({ provider_base_id }));
  let messages = createMultiGallery(galleryData);
  res.send({ messages });
}

module.exports = viewActivePromos;