let { createBtn } = require('../libs/bots.js');

let createRequestedRunnerCard = async (data) => {
  let { requested_runner } = data;

  let runner = runner.fields;

  let runner_messenger_user_id = runner['messenger user id'];

  let title = `${runner['First Name']} ${runner['Last Name']}`;
  let subtitle = `${runner['Gender']} | ${runner['Zip Code']}`;
  let image_url = runner['Profile Image URL'];

  let accept_request_btn = createBtn(
    `Accept Request|show_block|[JSON] Accept Partner Request`,
    { runner_messenger_user_id }
  );

  let buttons = [accept_request_btn];

  return { title, subtitle, buttons };
}

module.exports = {
  createRequestedRunnerCard,
}