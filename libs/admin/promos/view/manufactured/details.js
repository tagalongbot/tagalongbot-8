let { BASEURL } = process.env;

let { createBtn, createButtonMessage } = require('../../../../../libs/bots.js');
let { createURL } = require('../../../../../libs/helpers.js');

let createDetailsMsg = (data) => {
  let { service_id, promo_id, promo, practice_id, practice_promos_base_id } = data;

  let create_promo_btn = createBtn(
    `Create Promo|show_block|[JSON] Create Manufactured Promo`,
    { service_id, promo_id, practice_id, practice_promos_base_id }
  );

  let msg = createButtonMessage(
    promo.fields['Details'],
    create_promo_btn
  );

  return msg;
}

module.exports = {
  createDetailsMsg
}