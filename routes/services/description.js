let { getPracticeByID } = require('../../libs/data/practices.js');
let { getServiceByID } = require('../../libs/data/services.js');
let { createFindPracticesMsg, createViewPracticePromosMsg } = require('../../libs/services/description.js');

let getServiceDescription = async ({ query, params }, res) => {
  let { show_practices } = params;
  let { service_id, practice_id, messenger_user_id, first_name, last_name, gender } = query;

  let service = await getServiceByID({ service_id });

  if (show_practices === 'no') {
    let msg = createViewPracticePromosMsg(
      { service, practice_id, messenger_user_id, first_name, last_name, gender }
    );

    let messages = [msg];
    res.send({ messages });
    return;
  }

  let msg = createFindPracticesMsg(
    { service }
  );

  let messages = [msg];
  res.send({ messages });
}

module.exports = getServiceDescription;