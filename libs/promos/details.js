let { BASEURL } = process.env;
let { createButtonMessage } = require('../../libs/bots.js');
let { createURL } = require('../../libs/helpers.js');

let createDetailsMsg = (promo, data) => {
  let { provider_id, provider_base_id, promo_id, first_name, last_name, gender, messenger_user_id } = data;

  let claim_promo_url = createURL(
    `${BASEURL}/promos/claim/email`, 
    { provider_id, promo_id }
  );
  
  let view_provider_url = createURL(
    `${BASEURL}/promos/provider`, 
    { provider_id, provider_base_id, promo_id, first_name, last_name, gender, messenger_user_id }
  );

  let msg = createButtonMessage(
    promo.fields['Details'],
    `Claim Promotion|json_plugin_url|${claim_promo_url}`,
    `View Promo Provider|json_plugin_url|${view_provider_url}`,
  );

  return msg;
}

module.exports = {
  createDetailsMsg,
}