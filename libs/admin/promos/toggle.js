let { BASEURL } = process.env;
let { createURL } = require('../../../libs/helpers');
let { createButtonMessage } = require('../../../libs/bots');

let { getTable, getAllDataFromTable, findTableData, updateTableData } = require('../../../libs/data');

let getPromosTable = getTable('Promos');
let getUsersTable = getTable('Users');

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

module.exports = {
  getPromo,
  updatePromo,
}