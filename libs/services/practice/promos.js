let { createBtn, createButtonMessage } = require('../../../libs/bots.js');

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

  let view_services_btn = createBtn(
    `View Services Again|show_block|[JSON] Get Practice Services`,
    { practice_id }
  );

  let main_menu_btn = createBtn(
    `Main Menu|show_block|Main Menu`,
  );
  
  let about_bb_btn = createBtn(
    `About Bevl Beauty|show_block|AboutBB`,
  );

  let msg = createButtonMessage(
    `Sorry looks like ${practice_name} does not have any promotions for ${service_name} at the moment`,
    view_services_btn,
    main_menu_btn,
    about_bb_btn,
  );

  return msg;
}

module.exports = {
  getServicePromos,
  createNoPromosMsg,
}