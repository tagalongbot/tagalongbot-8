let { BASEURL } = process.env;
let { createButtonMessage } = require('../libs/bots');
let { createURL } = require('../libs/helpers');
let { getProviderByUserID } = require('../libs/providers');

let { getTable, findTableData, updateTableData } = require('../libs/data');

let getPromosTable = getTable('Promos');
let getUsersTable = getTable('Users');

let getUser = async ({ provider_base_id, user_id }) => {
  let usersTable = getUsersTable(provider_base_id); 
  let findUser = findTableData(usersTable);
  let user = await findUser(user_id);
  return user;
}

let getPromo = async ({ provider_base_id, promo_id }) => {
  let promosTable = getPromosTable(provider_base_id);
  let findPromo = findTableData(promosTable);
  let promo = await findPromo(promo_id);
  return promo;
}

let updatePromo = async ({ provider_base_id, promo, user_id }) => {
  let promosTable = getPromosTable(provider_base_id);
  let updatePromoFromTable = updateTableData(promosTable);

  let already_used_user_ids = promo.fields['Promo Used By Users'];
  let total_used = Number(promo.fields['Total Used']);

  let new_used_user_ids = [
    ...new Set([user_id, ...already_used_user_ids])
  ];

  let updateData = {
    ['Promo Used By Users']: new_used_user_ids,
    ['Total Used']: total_used + 1
  }

  let updatedPromo = await updatePromoFromTable(updateData, promo);
  return updatedPromo;
}

let createUpdateMsg = async () => {
  let msg = createButtonMessage(
    `Promo Claimed Successfully`,
    `Admin Menu|show_block|Get Admin Menu`,
  );

  return [msg];
}

let updateVerifiedPromo = async ({ query }, res) => {
  let messenger_user_id = query['messenger user id'];
  let { promo_id, user_id, provider_base_id } = query;

  let provider = await getProviderByUserID(messenger_user_id);
  let provider_base_id = provider.fields['Practice Base ID'];

  let promo = await getPromo({ provider_base_id, promo_id });
  let user = await getUser({ provider_base_id, user_id });

  if (!user) {
    let redirect_to_blocks = ['[Admin Verify Promo] User Does Not Exist'];
    res.send({ redirect_to_blocks });
    return;
  }

  let user_ids = promo.fields['Promo Used By Users'];

  if (user_ids.includes(user_id)) {
    let msg = createUserAlreadyUsedMsg({ provider_base_id, user_id });
    res.send(msg);
    return;
  }

  let updatedPromo = await updatePromo({ provider_base_id, promo, user_id });

  let messages = createUpdateMsg();
  res.send({ messages });
}

module.exports = {
  getUserIDForPromoUpdate,
  updateVerifiedPromo,
}