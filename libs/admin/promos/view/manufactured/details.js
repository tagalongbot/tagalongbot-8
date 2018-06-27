let { BASEURL } = process.env;
let { createButtonMessage } = require('../../../../../libs/bots.js');
let { createURL } = require('../../../../../libs/helpers.js');

let createDetailsMsg = (data) => {
  let { service_id, promo_id, promo, practice_id, practice_base_id } = data;

  let create_promo_url = createURL(
    `${BASEURL}/admin/promos/create/manufactured/service/create`,
    { service_id, promo_id, practice_id, practice_base_id }
  );

  let msg = createButtonMessage(
    promo.fields['Details'],
    `Create Promo|json_plugin_url|${create_promo_url}`
  );

  return msg;
}

module.exports = {
  createDetailsMsg
}