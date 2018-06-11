let { BASEURL } = process.env;
let { createButtonMessage, createMultiGallery } = require('../libs/bots');
let { createURL } = require('../libs/helpers');
let { getProviderByUserID } = require('../libs/providers');

let { getTable, getAllDataFromTable, findTableData } = require('../libs/data');

let getPromosTable = getTable('Promos');
let getUsersTable = getTable('Users');

let getUser = async ({ user_messenger_id, provider_base_id }) => {
  let usersTable = getUsersTable(provider_base_id);
  let getUsers = getAllDataFromTable(usersTable);

  let filterByFormula = `{ messenger user id } = '${user_messenger_id}'`;
  let [user] = await getUsers({ filterByFormula });
  return user;
}

let getUserPromos = async ({ provider_base_id, user_id }) => {
  let promosTable = getPromosTable(provider_base_id);
  let getPromos = getAllDataFromTable(promosTable);
  let view = 'Active Promos';
  let promos = await getPromos({ view });
  
  let matched_promos = promos.filter(
    promo => promo.fields['Claimed By Users'].includes(user_id)
  );

  return matched_promos;
}

let createUpdateBtn = ({ provider_base_id, promo_id, user_messenger_id }) => {
  let update_promo_url = createURL(`${BASEURL}/promo/verify/update`, { provider_base_id, promo_id, user_messenger_id });
  let btn2 = {
    title: 'Mark Promo As Used',
    type: 'json_plugin_url',
    url: update_promo_url,
  }

  buttons = [btn2, ...buttons];
}

let toGalleryElement = ({ provider_base_id, messenger_user_id, user_messenger_id, user_record_id }) => ({ id: promo_id, fields: promo }) => {
  let title = promo['Promotion Name'];
  let subtitle = promo['Terms'];
  let image_url = promo['Image URL'];

  let data = { provider_base_id, promo_id, user_messenger_id };
  let view_promo_info_url = createURL(`${BASEURL}/promo/info`, data);

  let btn1 = {
    title: 'View Promo Details',
    type: 'json_plugin_url',
    url: view_promo_info_url,
  }
  
  let buttons = [btn1];
  
  let btn2 = createUpdateBtn();
  
  if (btn2) buttons = [btn2,
  
  let buttons = createButtons(
    data,
    [btn1]
  );
  
  let user_ids = promo.fields['Promo Used By Users'];
  if ( !user_ids.includes(user_record_id) ) {
    
  }

  return { title, subtitle, image_url, buttons };
}

let verifyPromo = async ({ query }, res) => {
  // `messenger_user_id` is the messenger id of the provider
  // `user_messenger_id` is the messenger id of the consumer
  let messenger_user_id = query['messenger user id'];
  let user_messenger_id = query['user_messenger_id'];

  let provider = await getProviderByUserID(messenger_user_id);
  let provider_base_id = provider.fields['Practice Base ID'];

  let user = await getUser({ provider_base_id, user_messenger_id });
  let promos = await getUserPromos({ provider_base_id, user_messenger_id });

  if (!promos[0]) {
    let redirect_to_blocks = ['[Admin Verify Promo] No User Promos Found'];
    let user_name = user.fields['First Name'];
    let set_attributes = { user_name };
    res.send({ redirect_to_blocks, set_attributes });
    return;
  }

  let galleryData = promos.map(
    toGalleryElement({ provider_base_id, messenger_user_id, user_messenger_id })
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