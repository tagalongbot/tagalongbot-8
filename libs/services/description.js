let { BASEURL } = process.env;

let { createButtonMessage } = require('../../libs/bots.js');
let { createURL } = require('../../libs/helpers.js');

let createFindPracticesMsg = ({ service, service_id, messenger_user_id, first_name, last_name, gender }) => {
  let find_practices_btn_url = createURL(
    `${BASEURL}/services/providers`, 
    { service_id }
  );

  let find_promos_btn_url = createURL(
    `${BASEURL}/services/promos`,
    { service_id, messenger_user_id, first_name, last_name, gender }
  );

  let txtMsg = createButtonMessage(
    service.fields['Long Description'].slice(0, 640),
    `Find Practices|json_plugin_url|${find_practices_btn_url}`,
    `Find Promos|json_plugin_url|${find_promos_btn_url}`,
  );

  return txtMsg;
}

let createViewPracticePromosMsg = (service, data) => {
  let { messenger_user_id, first_name, last_name, gender, service_id, practice_id, practice_name } = data;

  let service_name = service.fields['Name'];

  let view_practice_promos = createURL(
    `${BASEURL}/services/practice/promos`, 
    { messenger_user_id, first_name, last_name, gender, service_id, practice_id }
  );

  let txtMsg = createButtonMessage(
    service.fields['Long Description'].slice(0, 640),
    `View Promos|json_plugin_url|${view_practice_promos}`
  );

  return txtMsg;
}

module.exports = {
  createFindPracticesMsg,
  createViewPracticePromosMsg,
}