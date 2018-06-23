let { BASEURL } = process.env;
let { createURL, localizeDate } = require('../../../libs/helpers.js');
let { createButtonMessage } = require('../../../libs/bots.js');
let { updatePracticePromo } = require('../../../libs/data/practice/promos.js');

let createPromoFieldValue = ({ update_promo_field_name, update_promo_field_value }) => {  
  if (update_promo_field_name == 'Claim Limit') {
    return Number(update_promo_field_value);
  }

  return update_promo_field_value;
}

let updatePromo = async ({ provider_base_id, promo, update_promo_field_name, update_promo_field_value }) => {
  let promo_data = {
    [update_promo_field_name]: createPromoFieldValue({ update_promo_field_name, update_promo_field_value })
  }

  let updatedPromo = await updatePracticePromo({ provider_base_id, promo_data, promo });
  return updatedPromo;
}

let createUpdateMsg = ({ messenger_user_id, promo_id, provider_base_id, promo, updatedPromo, update_promo_field_name, update_promo_field_value }) => {
  let text = `Updated ${update_promo_field_name} to "${update_promo_field_value}" for ${promo.fields['Promotion Name']} `;

  let view_promo_details_url = createURL(
    `${BASEURL}/admin/promos/view/info`, 
    { messenger_user_id, promo_id, provider_base_id }
  );
  
  let update_promo_url = createURL(
    `${BASEURL}/admin/promos/update`, 
    { messenger_user_id, promo_id, provider_base_id }
  );
  
  let toggle_promo_url = createURL(
    `${BASEURL}/admin/promos/toggle`, 
    { messenger_user_id, promo_id, provider_base_id }
  );

  let msg = createButtonMessage(
    text,
    `View Promo Details|json_plugin_url|${view_promo_details_url}`,
    `Update Promo|json_plugin_url|${update_promo_url}`,
    `${updatedPromo.fields['Active?'] ? 'Deactivate' : 'Activate'}|json_plugin_url|${toggle_promo_url}`,
  );
  
  return msg;
}

module.exports = {
  updatePromo,
  createUpdateMsg,
}