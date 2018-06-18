let { BASEURL } = process.env;
let { createBtn } = require('../../../libs/bots.js');
let { createURL, localizeDate } = require('../../../libs/helpers.js');
let { getProviderByID } = require('../../../libs/data/providers.js');
let { getPracticePromos } = require('../../../libs/data/practice/promos.js');
let { getUserPromos } = require('../../../libs/data/practice/users.js');

let getUserClaimedPromos = ({ messenger_user_id, user_id }) => async (provider_id) => {
  let provider = await getProviderByID(provider_id);
  let provider_base_id = provider.fields['Practice Base ID'];

  let user = await getUserPromos({ provider_base_id, user_id });
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

  let view_promo_details_url = createURL(
    `${BASEURL}/promos/details`, 
    { promo_id, ...data }
  );

  let view_promo_provider_url = createURL(
    `${BASEURL}/promos/provider`, 
    { promo_id, ...data }
  );

  let btn1 = createBtn(`View Promo Info|json_plugin_url|${view_promo_details_url}`);
  let btn2 = createBtn(`View Promo Provider|json_plugin_url|${view_promo_provider_url}`);
  let btn3 = createBtn(`Get My User ID|show_block|Get User ID`);

  let buttons = [btn1, btn2, btn3];

  return { title, subtitle, image_url, buttons };
}

module.exports = {
  getUserClaimedPromos,
  toGalleryElement,
}