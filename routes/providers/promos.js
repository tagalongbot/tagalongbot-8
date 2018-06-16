let { BASEURL } = process.env;
let { createURL } = require('../../libs/helpers.js');
let { createGallery } = require('../../libs/bots.js');

let { getPracticePromos } = require('../../libs/data/practice/promos.js');
let { toGalleryElement } = require('../../libs/providers/promos.js');

let getProviderPromos = async ({ query }, res) => {
  let { provider_id, provider_base_id, first_name, last_name, gender, messenger_user_id } = query;

  let promos = await getPracticePromos({ provider_base_id });  

  if (!promos[0]) {
    let redirect_to_blocks = ['No Provider Promos Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let promosGalleryData = promos.map(
    toGalleryElement({ provider_id, provider_base_id, first_name, last_name, gender, messenger_user_id })
  ).slice(0, 5);

  let servicesGallery = createGallery(promosGalleryData);
  let messages = [servicesGallery];
  res.send({ messages });
}

module.exports = getProviderPromos;