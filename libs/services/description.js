let { BASEURL } = process.env;

let { createButtonMessage } = require('../../libs/bots.js');
let { createURL } = require('../../libs/helpers.js');

let createViewPracticePromosMsg = (data) => {
  let { service, practice_id, messenger_user_id, first_name, last_name, gender } = data;

  let service_id = service.id;

  let view_practice_promos = createURL(
    `${BASEURL}/services/practice/promos`, 
    { service_id, practice_id, messenger_user_id, first_name, last_name, gender }
  );

  let txtMsg = createButtonMessage(
    service.fields['Long Description'].slice(0, 640),
    `View Promos|json_plugin_url|${view_practice_promos}`
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