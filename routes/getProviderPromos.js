let { BASEURL } = process.env;
let { createGallery } = require('../libs/bots');
let { getActivePromos } = require('../libs/data');

let toGalleryElement = (provider_name) => (promo) => {
  let title = promo.promo_name;
  let subtitle = promo.promo_terms;
  let image_url = promo.promo_photo_uri;

  let btn1 = {
    title: 'Read Promo Details',
    type: 'json_plugin_url',
    url: `${BASEURL}/promo/details?promo_id=${promo.promoid}`
  }

  let buttons = [btn1];
  
  let element = { title, subtitle, image_url, buttons };
  return element;
}

let getProviderPromos = async ({ query }, res) => {
  let { provider_id, provider_name } = query;

  let activePromos = await getActivePromos();
  let providerPromos = activePromos
    .filter((promo) => promo.providerid === Number(provider_id));
  

  let promosGalleryData = providerPromos.map(toGalleryElement(provider_name));
  let servicesGallery = createGallery(promosGalleryData);
  let messages = [servicesGallery];
  res.send({ messages });
}

module.exports = getProviderPromos;