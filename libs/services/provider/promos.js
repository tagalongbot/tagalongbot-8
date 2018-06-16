let { BASEURL } = process.env;
let { createURL } = require('../../../libs/helpers.js');
let { createButtonMessage } = require('../../../libs/bots.js');
let { getProviderByID } = require('../../../libs/providers.js');

let { getTable, getAllDataFromTable, findTableData } = require('../../../libs/data.js');

let getPromosTable = getTable('Promos');

let getServicePromos = async ({ service_name, provider_base_id }) => {
  let lower_cased_service_name = service_name.toLowerCase();

  let promosTable = getPromosTable(provider_base_id);
  let getPromosFromTable = getAllDataFromTable(promosTable);
  let view = 'Active Promos';
  let promos = await getPromosFromTable({ view });

  let matched_promos = promos.filter(
    promo => promo.fields['Type'].toLowerCase().includes(lower_cased_service_name)
  );

  return matched_promos;
}

let createNoPromosMsg = (data) => {
  let { first_name, service_name, provider_id, provider_name } = data;

  let view_services_btn_url = createURL(
    `${BASEURL}/providers/services`,
    { first_name, provider_id }
  );

  let msg = createButtonMessage(
    `Sorry ${first_name} looks like ${provider_name} does not have any promotions for ${service_name} at the moment`,
    `View Services Again|json_plugin_url|${view_services_btn_url}`,
    `Main Menu|show_block|Discover Main Menu`,
    `About Bevl Beauty|show_block|About Bevl Beauty`
  );

  return [msg];
}

module.exports = {
  getServicePromos,
  createNoPromosMsg,
}