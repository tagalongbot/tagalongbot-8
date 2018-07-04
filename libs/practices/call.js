let { createButtonMessage } = require('../../libs/bots.js');

let createCustomerMsg = ({ user_name, practice_name }) => {
  let msg = createButtonMessage(
    `Hey ${user_name} you'll receive a call right now connecting you to ${practice_name} practice`,
    `Main Menu|show_block|Discover Main Menu`,
  );

  return msg;
}