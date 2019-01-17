let { sendBroadcast } = require('../../libs/chatfuel.js');

let sendToCreateProfileBlock = async ({ query }, res) => {
  let {  } = query;

  let user_id = ``;
  let block_name = '';
  let message_tag = '';
  let user_attributes = {
    
  }

  let sent_broadcast = await sendBroadcast(
    { user_id, block_name, message_tag, user_attributes }
  );
}

module.exports = sendToCreateProfileBlock;