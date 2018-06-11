let { BASEURL, PRACTICE_DATABASE_BASE_ID } = process.env;
let { createGallery } = require('../libs/bots');
let { createURL } = require('../libs/helpers');
let { getTable, findTableData } = require('../libs/data');

let getProvidersTable = getTable('Practices');
let getPromosTable = getTable('Promos');

let providerTable = getProvidersTable(PRACTICE_DATABASE_BASE_ID);
let findProvider = findTableData(providerTable);

let toGalleryElement = ({ first_name, last_name, gender, messenger_user_id }) => ({ id: provider_id, fields: provider }) => {
  let title = provider['Practice Name'].slice(0, 80);
  let subtitle = `${provider['Main Provider']} | ${provider['Practice Address']}`.slice(0, 80);
  let image_url = provider['Main Provider Image'][0].url;

  let provider_base_id = provider['Practice Base ID'];

  let data = { provider_id, provider_base_id, first_name, last_name, gender, messenger_user_id };
  let promos_btn_url = createURL(`${BASEURL}/provider/promos`, data);
  let services_btn_url = createURL(`${BASEURL}/provider/services`, data);

  let btn1 = {
    title: 'View Promos',
    type: 'json_plugin_url',
    url: promos_btn_url,
  }

  let btn2 = {
    title: 'View Services',
    type: 'json_plugin_url',
    url: services_btn_url,
  }

  let buttons = [btn1, btn2];

  let element = { title, subtitle, image_url, buttons};
  return element;
}

let getPromoProvider = async ({ query }, res) => {
  let { provider_id, provider_base_id, promo_id, first_name, last_name, gender1, messenger_user_id } = query;

  let promosTable = getPromosTable(provider_base_id);
  let findPromo = findTableData(promosTable);
  let promo = await findPromo(promo_id);

  if (!promo) {
    let redirect_to_blocks = ['Promo No Longer Active'];
    res.send({ redirect_to_blocks });
    return;
  }

  let provider = await findProvider(provider_id);

  if (!provider) {
    let redirect_to_blocks = ['No Providers Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let providersGalleryData = [provider].map(toGalleryElement({ first_name, last_name, gender: gender1, messenger_user_id }));
  let providersGallery = createGallery(providersGalleryData);
  let messages = [providersGallery];
  res.send({ messages });
}

module.exports = getPromoProvider;