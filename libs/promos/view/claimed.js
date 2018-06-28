let { BASEURL } = process.env;
let { createBtn } = require('../../../libs/bots.js');
let { createURL, localizeDate } = require('../../../libs/helpers.js');
let { getProviderByID } = require('../../../libs/data/practices.js);
let { getPracticeUser, getUserPromos } = require('../../../libs/data/practice/users.js');

let getUserClaimedPromos = (data) => async (practice_id) => {
  let { messenger_user_id, first_name, last_name, gender } = data;
  let practice = await getProviderByID(provider_id);
  let practice_base_id = practice.fields['Practice Base ID'];

  let user = await getPracticeUser({ provider_base_id, user_messenger_id: messenger_user_id });
  let user_promos = await getUserPromos({ provider_base_id, user_id: user.id });

  return user_promos.map(
    toGalleryElement({ practice_id, practice_base_id, messenger_user_id, first_name, last_name, gender })
  );
}

let toGalleryElement = (data) => ({ id: promo_id, fields: promo }) => {
  let { practice_id, practice_base_id, messenger_user_id, first_name, last_name, gender } = data;

  let promo_expiration_date = new Date(promo['Expiration Date']);

  let title = promo['Promotion Name'];
  let subtitle = `Promo Expires On ${localizeDate(promo_expiration_date)}`;
  let image_url = promo['Image URL'];

  let view_promo_details_url = createURL(
    `${BASEURL}/promos/details/claimed`,
    { practice_id, practice_base_id, promo_id, messenger_user_id, first_name, last_name, gender }
  );

  let view_promo_provider_url = createURL(
    `${BASEURL}/promos/provider`,
    { practice_id, practice_base_id, promo_id, messenger_user_id, first_name, last_name, gender }
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