let { sendBroadcast } = require('../../libs/chatfuel.js');

let sendToCreateProfileBlock = async ({ query }, res) => {
  let { user_id } = query;

  let block_name = '[ROUTER] Create Profile';
  let message_tag = '';
  let user_attributes = {
    
  }

  let sent_broadcast = await sendBroadcast(
    { user_id, block_name, message_tag, user_attributes }
  );
}

module.exports = sendToCreateProfileBlock;