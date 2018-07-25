let { createBtn, createButtonMessage } = require('../../libs/bots.js');

let createViewPracticePromosMsg = (data) => {
  let { service, service_id, practice_id } = data;

  let view_practice_promos_btn = createBtn(
    `View Promos|show_block|[JSON] Get Service Practice Promos`,
    { service_id, practice_id }
  );

  let txtMsg = createButtonMessage(
    service.fields['Long Description'].slice(0, 640),
    view_practice_promos_btn,
  );

  return txtMsg;
}

let createFindPracticesMsg = (data) => {
  let { service } = data;

  let service_id = service.id;

  let find_practices_btn = createBtn(
    `Find Practices|show_block|[ROUTER] Search Practice Services`,
    { service_id }
  );

  let find_promos_btn = createBtn(
    `Find Promos|show_block|[ROUTER] Search Promos Services`,
    { service_id }
  );

  let txtMsg = createButtonMessage(
    service.fields['Long Description'].slice(0, 640),
    find_practices_btn,
    find_promos_btn,
  );

  return txtMsg;
}

module.exports = {
  createViewPracticePromosMsg,
  createFindPracticesMsg,
}