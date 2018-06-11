let { BASEURL, PRACTICE_DATABASE_BASE_ID } = process.env;
let { createButtonMessage, createMultiGallery } = require('../libs/bots');
let { createURL } = require('../libs/helpers');
let { getProviderByUserID } = require('../libs/providers');

let { getTable, getAllDataTable, findTableData } = require('../libs/data');

let getPracticesTable = getTable('Practices');
let practicesTable = getPracticesTable(PRACTICE_DATABASE_BASE_ID);
let findPractice = findTableData(practicesTable);

let getPromosTable = getTable('Promos');
let getUsersTable = getTable('Users');

let getUser = async ({ user_id }) => {

}

let getUserPromos = async ({ provider_base_id, user_id }) => {
  let promosTable = getPromosTable(provider_base_id);
  let getPromos = getAllDataTable(promosTable);
  let view = 'Active Promos';
  let promos = await getPromos({ view });
  
  let matched_promos = promos.filter(
    promo => promo.fields['Claimed By Users'].includes(user_id)
  );

  return matched_promos;
}

let toGalleryElement = ({ provider_base_id, messenger_user_id }) => ({ id: promo_id, fields: promo }) => {
  let title = promo['Promotion Name'];
  let subtitle = promo['Terms'];
  let image_url = promo['Image URL'];

  let view_promo_info_url = createURL(`${BASEURL}/promo/info`, { provider_base_id, promo_id, messenger_user_id });
  let update_promo_url = createURL(`${BASEURL}/promo/verify/update`, { provider_base_id, promo_id });

  let btn1 = {
    title: 'View Promo Details',
    type: 'json_plugin_url',
    url: view_promo_info_url,
  }

  let btn2 = {
    title: 'Mark Promo As Used',
    type: 'json_plugin_url',
    url: update_promo_url,
  }

  let buttons = [btn1];

  return { title, subtitle, image_url, buttons };
}

let verifyPromo = async ({ query }, res) => {
  let messenger_user_id = query['messenger user id'];
  let user_id = query['user_id'];

  let provider = await getProviderByUserID(messenger_user_id);
  let provider_base_id = provider.fields['Practice Base ID'];

  let promos = await getUserPromos({ provider_base_id, user_id });

  if (!promos[0]) {
    let redirect_to_blocks = ['[Admin Verify Promo] No User Promos Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let galleryData = promos.map(
    toGalleryElement({ provider_base_id, messenger_user_id })
  );

  let messages = createMultiGallery(galleryData);
  res.send({ messages });
}

module.exports = verifyPromo;

/*
  if (promo.fields['Total Used'] >= promo.fields['Total Claim Count']) {
    let redirect_to_users = ['[Admin Verify Promo] Used Limit Reached'];
    let promo_claim_limit = promo.fields['Total Claim Count'];
    let set_attributes = { promo_claim_limit };
    res.send({ redirect_to_users });
    return;
  }
*/