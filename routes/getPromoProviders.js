let { BASEURL } = process.env;
let { createGallery } = require('../libs/bots');
let { getActivePromos, getActiveProviders } = require('../libs/data');

let toGalleryElement = (promo) => (provider) => {
  let title = provider.practice_name.slice(0, 80);
  let subtitle = `${provider.first_name} ${provider.last_name} | ${provider.address}`;
  let image_url = provider.practice_panel_photo_uri;

  let btn1 = {
    title: 'Claim Promotion',
    type: 'json_plugin_url',
    url: `${BASEURL}/promo/claim?promo_id=${promo.promoid}`
  }

  let btn2 = {
    title: 'View Services',
    type: 'json_plugin_url',
    url: `${BASEURL}/provider/services?provider_id=${provider.providerid}&provider_name=${encodeURIComponent(provider.practice_name)}`
  }

  let btn3 = {
    title: 'View Promos',
    type: 'json_plugin_url',
    url: `${BASEURL}/provider/promos?provider_id=${provider.providerid}&provider_name=${encodeURIComponent(provider.practice_name)}`
  }
  
  let buttons = [btn1, btn2, btn3];
  
  let element = { title, subtitle, image_url, buttons };
  return element;
}

let getPromoProviders = async ({ query }, res) => {
  let { promo_id } = query;

  let activePromos = await getActivePromos();
  let promo = activePromos.find((promo) => promo.promoid === Number(promo_id));

  if (!promo) {
    let redirect_to_blocks = ['Provider No Longer Active'];
    res.send({ redirect_to_blocks });
    return;
  }

  let activeProviders = await getActiveProviders();
  
  let provider = activeProviders.find((provider) => provider.providerid === promo.providerid);
  
  let promosGalleryData = [provider].map(toGalleryElement(promo));
  let servicesGallery = createGallery(promosGalleryData);
  let messages = [servicesGallery];
  res.send({ messages });
}

module.exports = getPromoProviders;