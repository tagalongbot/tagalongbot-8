let { createBtn } = require('../../libs/bots.js');

let createRunnersCards = (runner) => {
  let runner_messenger_user_id = runner.fields['messenger user id'];

  let title = `${runner.fields['First Name']} ${runner.fields['Last Name']}`;
  let subtitle = runner.fields['Gender'];
  let image_url = `${runner.fields['Profile Image URL']}`;

  let send_request_btn = createBtn(
    `Send Request|show_block|[JSON] Send Partner Request`,
    { runner_messenger_user_id }
  );

  let buttons = [send_request_btn];

  return { title, image_url, buttons };
}

module.exports = {
  createRunnersCards,
}