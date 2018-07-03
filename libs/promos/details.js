let { BASEURL } = process.env;

let { createButtonMessage } = require('../../libs/bots.js');
let { createURL } = require('../../libs/helpers.js');

let createDetailsMsg = (promo, data, { is_claimed }) => {
  let { practice_id, practice_promos_base_id, promo_id, first_name, last_name, gender, messenger_user_id } = data;

  let btns = [];

  if (is_claimed.toLowerCase() != 'claimed') {
    let claim_promo_url = createURL(
      `${BASEURL}/promos/claim/user_info`, 
      { practice_id, promo_id }
    );

    btns.push(`Claim Promotion|json_plugin_url|${claim_promo_url}`);
  }

  let view_practice_url = createURL(
    `${BASEURL}/promos/practice`, 
    { practice_id, practice_promos_base_id, promo_id, first_name, last_name, gender, messenger_user_id }
  );

  btns.push(`View Promo Provider|json_plugin_url|${view_practice_url}`);

  let msg = createButtonMessage(
    promo.fields['Details'],
    ...btns
  );

  return msg;
}

module.exports = {
  createDetailsMsg,
}