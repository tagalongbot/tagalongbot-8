let { BASEURL } = process.env;
let { createGallery } = require('../libs/bots');
let { searchProviders } = require('../libs/providers');
let { getTable, findTableData } = require('../libs/data');

let getProviderTable = getTable('Practice');
let getPromosTable = getTable('Promos');

let providerTable = getProviderTable(PRACTICE_DATABASE_BASE_ID);
let findProvider = findTableData(providerTable);

let toGalleryElement = ({ id: provider_id, fields: provider }) => {
  let title = provider['Practice Name'].slice(0, 80);
  let subtitle = `${provider['Main Provider']} | ${provider['Practice Address']}`;
  let image_url = provider['Main Provider Image'][0].url;

  let btn1 = {
    title: 'Claim Promotion',
    type: 'json_plugin_url',
    url: `${BASEURL}/promo/claim?provider_id=${provider_id}&promo_id=${promo.promoid}`
  }
  
  let btn2 = {
    title: 'View Promos',
    type: 'json_plugin_url',
    url: `${BASEURL}/provider/promos?provider_id=${provider_id}&provider_name=${encodeURIComponent(provider['Practice Name'])}`
  }

  let btn3 = {
    title: 'View Services',
    type: 'json_plugin_url',
    url: `${BASEURL}/provider/services?provider_id=${provider_id}&provider_name=${encodeURIComponent(provider['Practice Name'])}`
  }

  let buttons = [btn1, btn2];

  let element = { title, subtitle, image_url, buttons};
  return element;
}

let getPromoProvider = async ({ query, params }, res) => {
  let {  } = query;
  
  let provider = await findProvider(provider_id);

  if (!provider) {
    let redirect_to_blocks = ['No Providers Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let providersGalleryData = toGalleryElement(provider);
  let providersGallery = createGallery(providersGalleryData);
  let messages = [providersGallery];
  res.send({ messages });
}

module.exports = getPromoProvider;