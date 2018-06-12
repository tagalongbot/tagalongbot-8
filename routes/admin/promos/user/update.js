let { BASEURL } = process.env;
let { createButtonMessage } = require('../libs/bots');
let { createURL } = require('../libs/helpers');

let { getTable, getAllDataFromTable, findTableData, updateTableData } = require('../libs/data');

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

let createUserDoesNotExistMsg = () => {
  let redirect_to_blocks = ['[Admin Verify Promo] User Does Not Exist'];
  return { redirect_to_blocks };
}

let createUserAlreadyUsedMsg = ({ user_name }) => {
  let set_attributes = { user_name };
  let redirect_to_blocks = ['User Already Used Promo'];
  return { set_attributes, redirect_to_blocks };
}

let createUpdateMsg = async () => {
  let msg = createButtonMessage(
    `Promo Claimed Successfully`,
    `Admin Menu|show_block|Get Admin Menu`,
  );

  return [msg];
}

let updateVerifiedPromo = async ({ query }, res) => {
  let { provider_base_id, promo_id, user_messenger_id } = query;

  let promo = await getPromo({ provider_base_id, promo_id });
  let user = await getUser({ provider_base_id, user_messenger_id });

  if (!user) {
    let msg = createUserDoesNotExistMsg();
    res.send(msg);
    return;
  }

  let user_record_id = user.id;
  let user_name = user.fields['First Name'];
  let user_ids = promo.fields['Promo Used By Users'];

  if (user_ids.includes(user_record_id)) {
    let msg = createUserAlreadyUsedMsg({ user_name });
    res.send(msg);
    return;
  }

  let updatedPromo = await updatePromo({ provider_base_id, promo, user_record_id });

  let messages = createUpdateMsg();
  res.send({ messages });
}

module.exports = updateVerifiedPromo;