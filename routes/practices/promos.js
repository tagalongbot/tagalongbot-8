let { BASEURL } = process.env;
let { createURL } = require('../../libs/helpers.js');
let { createGallery } = require('../../libs/bots.js');

let { getPracticePromos } = require('../../libs/data/practice/promos.js');
let { toGalleryElement } = require('../../libs/promos/promos.js');

let getPracticesPromos = async ({ query }, res) => {
  let { messenger_user_id, first_name, last_name, gender, service_id, practice_id, practice_base_id, practice_name } = query;

  let promos = await getPracticePromos({ provider_base_id });  

  if (!promos[0]) {
    let redirect_to_blocks = ['No Provider Promos Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let promosGalleryData = promos.map(
    toGalleryElement({ practice_id, practice_base_id, first_name, last_name, gender, messenger_user_id })
  ).slice(0, 5);

  let servicesGallery = createGallery(promosGalleryData);
  let messages = [servicesGallery];
  res.send({ messages });
}

module.exports = getPracticesPromos;