let { BASEURL } = process.env;
let { createURL } = require('../../../libs/helpers.js');
let { createButtonMessage } = require('../../../libs/bots.js');

let { getTable, getAllDataFromTable, updateTableData } = require('../../../libs/data.js');

let getPromosTable = getTable('Promos');
let getUsersTable = getTable('Users');

let updatePromo = async ({ provider_base_id, promo, update_promo_field_name, update_promo_field_value }) => {
  let promosTable = getPromosTable(provider_base_id);
  let updatePromoFromTable = updateTableData(promosTable);

  let updateData = {
    [update_promo_field_name]: update_promo_field_value
  }

  let updatedPromo = await updatePromoFromTable(updateData, promo);
  return updatedPromo;
}

let createUpdateMsg = ({ promo_id, provider_base_id, promo, updatedPromo, update_promo_field_name, update_promo_field_value }) => {
  let text = `Updated ${update_promo_field_name} to "${update_promo_field_value}" for ${promo.fields['Promotion Name']} `;

  let view_promo_details_url = createURL(`${BASEURL}/admin/promos/view/info`, { promo_id, provider_base_id });
  let update_promo_url = createURL(`${BASEURL}/admin/promos/update`, { promo_id, provider_base_id });
  let toggle_promo_url = createURL(`${BASEURL}/admin/promos/toggle`, { promo_id, provider_base_id });

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