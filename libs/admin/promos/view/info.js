let { BASEURL } = process.env;
let { createURL, localizeDate } = require('../../../../libs/helpers.js');
let { createButtonMessage } = require('../../../../libs/bots.js');

let createPromoMsg = ({ id: promo_id, fields: promo }, { provider_base_id, messenger_user_id }) => {
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

  let update_promo_url = createURL(`${BASEURL}/admin/promos/update`, { promo_id, provider_base_id });
  let toggle_promo_url = createURL(`${BASEURL}/admin/promos/toggle`, { promo_id, provider_base_id });
  let view_active_promos_url = createURL(`${BASEURL}/admin/promos/view/all`, { messenger_user_id });

  let msg = createButtonMessage(
    text,
    `${promo['Active?'] ? 'Deactivate' : 'Activate'}|json_plugin_url|${toggle_promo_url}`,
    `Update Promo|json_plugin_url|${update_promo_url}`,
    `View All Promotions|json_plugin_url|${view_active_promos_url}`
  );

  return msg;
}

module.exports = {
  createPromoMsg,
}