let { createBtn, createButtonMessage } = require('../../libs/bots.js');

let createDetailsMsg = (data) => {
  let { practice_id, practice_promos_base_id, promo, is_claimed } = data;

  let promo_id = promo.id;

  let btns = [];

  if (is_claimed.toLowerCase() != 'claimed') {
    let claim_promo_btn = createBtn(
      `Claim Promotion|show_block|[JSON] Get User Info (Claim Promo)`,
      { practice_id, promo_id }
    );

    btns = [claim_promo_btn];
  }

  let view_practice_btn = createBtn(
    `View Promo Provider|show_block|[JSON] View Promo Practice`,
    { practice_id, practice_promos_base_id, promo_id }
  );

  let msg = createButtonMessage(
    promo.fields['Details'],
    ...[...btns, view_practice_btn]
  );

  return msg;
}

module.exports = {
  createDetailsMsg,
}