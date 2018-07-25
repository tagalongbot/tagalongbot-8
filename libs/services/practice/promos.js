let { BASEURL } = process.env;

let { createURL } = require('../../../libs/helpers.js');
let { createButtonMessage } = require('../../../libs/bots.js');

let { getPracticeByID } = require('../../../libs/data/practices.js');
let { getPracticePromos } = require('../../../libs/data/practice/promos.js');

let getServicePromos = async (data) => {
  let { service, practice } = data;

  let service_name = service.fields['Name'];
  let practice_promos_base_id = practice.fields['Practice Promos Base ID'];

  let view = 'Active Promos';
  let promos = await getPracticePromos(
    { practice_promos_base_id, view }
  );

  let lower_cased_service_name = service_name.toLowerCase();
  let matched_promos = promos.filter(
    promo => promo.fields['Type'].toLowerCase().includes(lower_cased_service_name)
  );

  return matched_promos;
}

let createNoPromosMsg = (data) => {
  let { service, practice } = data;

  let practice_id = practice.id;
  let practice_name = practice.fields['Practice Name'];

  let service_name = service.fields['Name'];

  let view_services_btn_url = createURL(
    `${BASEURL}/practices/services`,
    { practice_id }
  );

  let msg = createButtonMessage(
    `Sorry looks like ${practice_name} does not have any promotions for ${service_name} at the moment`,
    `View Services Again|json_plugin_url|${view_services_btn_url}`,
    `Main Menu|show_block|Main Menu`,
    `About Bevl Beauty|show_block|AboutBB`
  );

  return msg;
}

module.exports = {
  getServicePromos,
  createNoPromosMsg,
}