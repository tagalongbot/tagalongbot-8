let { createBtn, createButtonMessage } = require('../../libs/bots.js');

let createViewPracticePromosMsg = (data) => {
  let { service, service_id, practice_id } = data;

  let view_practice_promos = createBtn(
    `View Promos|show_block|[JSON] Get Service Practice Promos`,
    { service_id, practice_id }
  );

  let txtMsg = createButtonMessage(
    service.fields['Long Description'].slice(0, 640),
    view_practice_promos,
  );

  return txtMsg;
}

let createFindPracticesMsg = (data) => {
  let { service } = data;

  let service_id = service.id;

  let find_practices_btn_url = createURL(
    `${BASEURL}/services/practices`, 
    { service_id }
  );

  let find_promos_btn_url = createURL(
    `${BASEURL}/services/promos`,
    { service_id }
  );

  let txtMsg = createButtonMessage(
    service.fields['Long Description'].slice(0, 640),
    `Find Practices|json_plugin_url|${find_practices_btn_url}`,
    `Find Promos|json_plugin_url|${find_promos_btn_url}`,
  );

  return txtMsg;
}

module.exports = {
  createViewPracticePromosMsg,
  createFindPracticesMsg,
}