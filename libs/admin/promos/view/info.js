let { localizeDate } = require('../../../../libs/helpers.js');
let { createBtn, createButtonMessage } = require('../../../../libs/bots.js');

let createPromoMsg = ({ promo: { id: promo_id, fields: promo }, practice_promos_base_id }) => {
  let expiration_date = new Date(promo['Expiration Date']);

  let text = [
    `Name: ${promo['Promotion Name']}`,
    `Type: ${promo['Type']}`,
    `Active: ${promo['Active?'] ? 'TRUE' : 'FALSE'}`,
    `Expiration Date: ${localizeDate(expiration_date)}`,
    `Claim Limit: ${promo['Claim Limit']}`,
    `Total Claim Count: ${promo['Total Claim Count']}`,
    `Total Used: ${promo['Total Used']}`,
    `Claim Limit Reached: ${(promo['Claim Limit Reached']) === 1 ? 'TRUE' : 'FALSE'}`,
    `All Claimed Promos Used: ${(promo['Total Claim Count'] === promo['Total Used'] && promo['Total Claim Count'] != 0) ? 'TRUE' : 'FALSE'}`,
  ].join('\n\n');

  let update_promo_btn = createBtn(
    `Update Promo|show_block|Update Promo`,
    { promo_id, practice_promos_base_id }
  );

  let toggle_promo_btn = createBtn(
    `${promo['Active?'] ? 'Deactivate' : 'Activate'}|show_block|[JSON] Toggle Promo`,
    { promo_id, practice_promos_base_id }
  );

  let admin_menu_btn = createBtn(
    `Admin Menu|show_block|[JSON] Admin Menu`
  );

  let msg = createButtonMessage(
    text,
    toggle_promo_btn,
    update_promo_btn,
    admin_menu_btn
  );

  return msg;
}

module.exports = {
  createPromoMsg,
}