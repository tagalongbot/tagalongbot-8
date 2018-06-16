let { BASEURL } = process.env;
let { createGallery } = require('../../libs/bots.js');
let { createURL } = require('../../libs/helpers.js');
let { getProviderByID } = require('../../libs/providers.js');
let { getPracticePromo } = require('../../libs/data/practice/promos.js');
let { toGalleryElement } = require('../../libs/providers/providers.js');

let getPromoProvider = async ({ query }, res) => {
  let { provider_id, provider_base_id, promo_id, first_name, last_name, gender, messenger_user_id } = query;

  let promo = await getPracticePromo({ provider_base_id, promo_id });

  if (!promo) {
    let redirect_to_blocks = ['Promo No Longer Active'];
    res.send({ redirect_to_blocks });
    return;
  }

  let provider = await getProviderByID(provider_id);

  if (!provider) {
    let redirect_to_blocks = ['No Providers Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let providersGalleryData = [provider].map(
    toGalleryElement({ first_name, last_name, gender, messenger_user_id })
  );

  let providersGallery = createGallery(providersGalleryData);
  let messages = [providersGallery];
  res.send({ messages });
}

module.exports = getPromoProvider;