let { createBtn, createButtonMessage } = require('../../libs/bots.js');

let createDetailsMsg = (data) => {
  let { practice_id, practice_promos_base_id, promo, is_claimed } = data;

  let promo_id = promo.id;

  let btns = [];

  if (is_claimed.toLowerCase() != 'claimed') {
    let claim_promo_btn = createBtn(
      `${BASEURL}/promos/claim/user_info`, 
      { practice_id, promo_id }
    );

    btns.push(`Claim Promotion|json_plugin_url|${claim_promo_url}`);
  }

  let view_practice_btn = createBtn(
    `${BASEURL}/promos/practice`, 
    { practice_id, practice_promos_base_id, promo_id }
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