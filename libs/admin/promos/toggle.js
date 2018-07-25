let { createBtn, createButtonMessage } = require('../../../libs/bots.js');

let { getTable, getAllDataFromTable, findTableData, updateTableData } = require('../../../libs/data.js');

let getPromosTable = getTable('Promos');
let getUsersTable = getTable('Users');

let getPromo = async ({ practice_promos_base_id, promo_id }) => {
  let promosTable = getPromosTable(practice_promos_base_id);
  let findPromo = findTableData(promosTable);
  let promo = await findPromo(promo_id);
  return promo;
}

let updatePromo = async ({ practice_promos_base_id, promo }) => {
  let promosTable = getPromosTable(practice_promos_base_id);
  let updatePromoFromTable = updateTableData(promosTable);

  let updateData = {
    ['Active?']: promo.fields['Active?'] ? false : true
  }
  
  let updated_promo = await updatePromoFromTable(updateData, promo);
  return updated_promo;
}

let createUpdateMsg = (data) => {
  let { promo_id, practice_promos_base_id, promo, updated_promo } = data;
  
  let toggle_promo_btn = createBtn(
    `${updated_promo.fields['Active?'] ? 'Deactivate' : 'Reactivate'}|show_block|[JSON] Toggle Promo`,
    { promo_id, practice_promos_base_id }
  );

  let view_promo_details_btn = createBtn(
    `View Promo Details|show_block|[JSON] View Promo Info`,
    { promo_id, practice_promos_base_id }
  );

  let view_all_promos_btn = createBtn(
    `View All Promotions|show_block|[JSON] View All Promotions`
  );

  let txtMsg = createButtonMessage(
    `The promo "${promo.fields['Promotion Name']}" is now "${updated_promo.fields['Active?'] ? 'Active' : 'Deactivated'}"`,
    toggle_promo_btn,
    view_promo_details_btn,
    view_all_promos_btn,
  );

  return txtMsg;
}

module.exports = {
  getPromo,
  updatePromo,
  createUpdateMsg,
}