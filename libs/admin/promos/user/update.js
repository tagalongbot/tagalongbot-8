let { createButtonMessage } = require('../../../../libs/bots');
let { getTable, getAllDataFromTable, findTableData, updateTableData } = require('../../../../libs/data');

let getPromosTable = getTable('Promos');
let getUsersTable = getTable('Users');

let getUser = async ({ user_messenger_id, provider_base_id }) => {
  let usersTable = getUsersTable(provider_base_id);
  let getUsers = getAllDataFromTable(usersTable);

  let filterByFormula = `{ messenger user id } = '${user_messenger_id}'`;
  let [user] = await getUsers({ filterByFormula });
  return user;
}

let getPromo = async ({ provider_base_id, promo_id }) => {
  let promosTable = getPromosTable(provider_base_id);
  let findPromo = findTableData(promosTable);
  let promo = await findPromo(promo_id);
  return promo;
}

let updatePromo = async ({ provider_base_id, promo, user_record_id }) => {
  let promosTable = getPromosTable(provider_base_id);
  let updatePromoFromTable = updateTableData(promosTable);

  let already_used_user_ids = promo.fields['Promo Used By Users'];
  let total_used = Number(promo.fields['Total Used']);

  let new_used_user_ids = [
    ...new Set([user_record_id, ...already_used_user_ids])
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

module.exports = {
  getUser,
  getPromo,
  updatePromo,
  createUpdateMsg,
}