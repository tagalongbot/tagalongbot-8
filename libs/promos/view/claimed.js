let { BASEURL } = process.env;
let { createURL, localizeDate } = require('../../../libs/helpers.js');
let { getProviderByID } = require('../../../libs/providers.js');
let { getPracticePromos } = require('../../../libs/data/practice/promos.js');
let { getPracticePromos } = require('../../../libs/data/practice/promos.js');


let getUserPromos = ({ messenger_user_id }) => async (provider_id) => {
  let provider = await getProviderByID(provider_id);
  let provider_base_id = provider.fields['Practice Base ID'];

  let user = await getUserFromPractice({ provider_base_id, messenger_user_id });
  let promos = await getPracticePromos({ provider_base_id });

  let promo_ids = user.fields['Promos Claimed'] || [];

  let user_promos = promos.filter(
    promo => promo_ids.includes(promo.id)
  );

  return user_promos;
}

let toGalleryElement = (data) => ({ id: promo_id, fields: promo }) => {
  let promo_expiration_date = new Date(promo['Expiration Date']);

  let title = promo['Promotion Name'];
  let subtitle = `Promo Expires On ${localizeDate(promo_expiration_date)}`;
  let image_url = promo['Image URL'];

  let get_promo_id_url = createURL(
    `${BASEURL}/promo/view/id`, 
    { promo_id, ...data }
  );
  
  let view_promo_provider_url = createURL(
    `${BASEURL}/promo/provider`, 
    { promo_id, ...data }
  );

  let btn1 = {
    title: 'Get Promo ID',
    type: 'json_plugin_url',
    url: get_promo_id_url
  }

  let btn2 = {
    title: 'View Promo Provider',
    type: 'json_plugin_url',
    url: view_promo_provider_url
  }

  let buttons = [btn1, btn2];

  return { title, subtitle, image_url, buttons };
}

module.exports = {
  getUserPromos,
  toGalleryElement,
}