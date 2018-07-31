let { createBtn, createButtonMessage } = require('../../../libs/bots.js');

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

module.exports = {
  createViewPracticePromosMsg,
}