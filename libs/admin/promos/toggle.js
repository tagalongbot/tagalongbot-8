let { createBtn, createButtonMessage } = require('../../../libs/bots.js');

let { updatePracticePromo } = require('../../../libs/data/practice/promos.js');

let updatePromo = async ({ practice_promos_base_id, promo }) => {
  let promo_data = {
    ['Active?']: promo.fields['Active?'] ? false : true
  }

  let updated_promo = await updatePracticePromo({ practice_promos_base_id, promo_data, promo });
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
  updatePromo,
  createUpdateMsg,
}