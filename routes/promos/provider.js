let { BASEURL } = process.env;
let { createGallery } = require('../../libs/bots.js');
let { createURL } = require('../../libs/helpers.js');
let { getProviderByID } = require('../../libs/data/providers.js');
let { getPracticePromo } = require('../../libs/data/practice/promos.js');
let { toGalleryElement } = require('../../libs/providers/providers.js');

let getPromoProvider = async ({ query }, res) => {
  let { practice_id, practice_base_id, promo_id, first_name, last_name, gender, messenger_user_id } = query;

  let promo = await getPracticePromo({ provider_base_id, promo_id });

  if (!promo) {
    let redirect_to_blocks = ['Promo No Longer Active'];
    res.send({ redirect_to_blocks });
    return;
  }

  let practice = await getProviderByID(provider_id);

  if (!practice) {
    let redirect_to_blocks = ['No Providers Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let providersGalleryData = [practice].map(
    toGalleryElement({ first_name, last_name, gender, messenger_user_id })
  );

  let practices_gallery = createGallery(providersGalleryData, 'square');
  let messages = [practices_gallery];
  res.send({ messages });
}

module.exports = getPromoProvider;