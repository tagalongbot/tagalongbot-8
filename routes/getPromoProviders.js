let { BASEURL } = process.env;
let { createGallery } = require('../libs/bots');
let { getActivePromos, getActiveProviders } = require('../libs/data');

let toGalleryElement = (provider) => {
  let title = provider.practice_name.slice(0, 80);
  let subtitle = `${provider.first_name} ${provider.last_name} | ${provider.address}`;
  let image_url = provider.practice_panel_photo_uri;

  let btn1 = {
    title: 'Read Promo Details',
    type: 'json_plugin_url',
    url: `${BASEURL}/promo/details?promo_id=${promo.promoid}`
  }

  let buttons = [btn1];
  
  let element = { title, subtitle, image_url, buttons };
  return element;
}

let getPromoProviders = async ({ query }, res) => {
  let { promo_id } = query;

  let activePromos = await getActivePromos();
  let promo = activePromos.find((promo) => promo.providerid === Number(promo_id));

  if (!promo[0]) {
    let redirect_to_blocks = ['Provider No Longer Active'];
    res.send({ redirect_to_blocks });
    return;
  }

  let activeProviders = await getActiveProviders();
  
  let provider = activeProviders.find((provider) => provider.providerid === promo.providerid);
  
  let promosGalleryData = [toGalleryElement(provider)];
  let servicesGallery = createGallery(promosGalleryData);
  let messages = [servicesGallery];
  res.send({ messages });
}

module.exports = getPromoProviders;