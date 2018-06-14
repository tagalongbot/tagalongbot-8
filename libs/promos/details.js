let { BASEURL } = process.env;
let { createButtonMessage } = require('../../libs/bots');
let { createURL } = require('../../libs/helpers');

let createDetailsMsg = ({ data, promo }) => {
  let { provider_id, promo_id } = data;
  
  let claim_promo_url = createURL(`${BASEURL}/promo/claim/email`, { provider_id, promo_id });
  let view_provider_url = createURL(`${BASEURL}/promo/provider`, data);

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