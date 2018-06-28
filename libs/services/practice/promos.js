let { BASEURL } = process.env;
let { createURL } = require('../../../libs/helpers.js');
let { createButtonMessage } = require('../../../libs/bots.js');
let { getPracticeByID } = require('../../../libs/data/practices.js');
let { getPracticePromos } = require('../../../libs/data/practice/promos.js');

let getServicePromos = async ({ service_name, practice_base_id }) => {
  let view = 'Active Promos';
  let promos = await getPracticePromos({ practice_base_id, view });

  let lower_cased_service_name = service_name.toLowerCase();
  let matched_promos = promos.filter(
    promo => promo.fields['Type'].toLowerCase().includes(lower_cased_service_name)
  );

  return matched_promos;
}

let createNoPromosMsg = (data) => {
  let { first_name, service_name, practice_id, practice_name } = data;

  let view_services_btn_url = createURL(
    `${BASEURL}/providers/services`,
    { first_name, practice_id }
  );

  let msg = createButtonMessage(
    `Sorry ${first_name} looks like ${practice_name} does not have any promotions for ${service_name} at the moment`,
    `View Services Again|json_plugin_url|${view_services_btn_url}`,
    `Main Menu|show_block|Discover Main Menu`,
    `About Bevl Beauty|show_block|About Bevl Beauty`
  );

  return msg;
}

module.exports = {
  getServicePromos,
  createNoPromosMsg,
}