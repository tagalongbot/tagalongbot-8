let { BASEURL } = process.env;
let { createURL } = require('../libs/helpers');
let { createGallery } = require('../libs/bots');
let { getTable, getAllDataFromTable } = require('../libs/data');

let getPromosTable = getTable('Promos');

let toGalleryElement = (data) => ({ id: promo_id, fields: promo }) => {
  let title = promo['Promotion Name'];
  let subtitle = promo['Terms'];
  let image_url = promo['Image'][0].url;

  let promo_details_btn_url = createURL(`${BASEURL}/promo/details`, { promo_id, ...data });

  let btn1 = {
    title: 'Read Promo Details',
    type: 'json_plugin_url',
    url: promo_details_btn_url,
  }

  let buttons = [btn1];

  let element = { title, subtitle, image_url, buttons };
  return element;
}

let searchPromos = async (provider_base_id) => {
  let promosTable = getPromosTable(provider_base_id);
  let getPromos = getAllDataFromTable(promosTable);
  
  let filterByFormula = `{Active?}`;
  let promos = await getPromos({ filterByFormula });
  return promos;
}

let getProviderPromos = async ({ query }, res) => {
  let { provider_id, provider_base_id, provider_name, first_name, last_name, gender1, messenger_user_id } = query;
  let data = { provider_id, provider_base_id, first_name, last_name, gender: gender1, messenger_user_id };
  let promos = await searchPromos(provider_base_id);  

  if (!promos[0]) {
    let redirect_to_blocks = ['No Provider Promos Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let promosGalleryData = promos.map(toGalleryElement(data)).slice(0, 5);
  let servicesGallery = createGallery(promosGalleryData);
  let messages = [servicesGallery];
  res.send({ messages });
}

module.exports = getProviderPromos;