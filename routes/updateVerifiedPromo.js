let { BASEURL, PRACTICE_DATABASE_BASE_ID } = process.env;
let { createButtonMessage } = require('../libs/bots');
let { createURL } = require('../libs/helpers');
let { getProviderByUserID } = require('../libs/provider');

let { getTable, findTableData, updateTableData } = require('../libs/data');

let getPracticesTable = getTable('Practices');
let practicesTable = getPracticesTable(PRACTICE_DATABASE_BASE_ID);
let findPractice = findTableData(practicesTable);
let getPromosTable = getTable('Promos');

let getPromo = async ({ provider_base_id, promo_id }) => {
  let promosTable = getPromosTable(provider_base_id);
  let findPromo = findTableData(promosTable);
  let promo = await findPromo(promo_id);
  return promo;
}

let updatePromo = async ({ provider_base_id, promo }) => {
  let promosTable = getPromosTable(provider_base_id);
  let updatePromoFromTable = updateTableData(promosTable);
  
  
  let updateData = {};
  
  let updatedPromo = await updatePromoFromTable(updateData, promo);
  return updatedPromo;
}

let getUserIDForPromoUpdate = async ({ query }, res) => {
  let { promo_id } = query;
  let set_attributes = { promo_id };
  let redirect_to_blocks = ['Update Verified Promo'];
  res.send({ set_attributes, redirect_to_blocks });
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
  let promo_id = query['promo_id'];

  let provider = await getProviderByUserID(messenger_user_id);
  let provider_base_id = provider.fields['Practice Base ID'];

  let promo = await getPromo({ provider_base_id, promo_id });
  let updatedPromo = await updatePromo({ provider_base_id, promo });

  let messages = createUpdateMsg();
  res.send({ messages });
}

module.exports = {
  getUserIDForPromoUpdate,
  updateVerifiedPromo,
}