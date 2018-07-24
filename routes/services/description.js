let { getPracticeByID } = require('../../libs/data/practices.js');
let { getServiceByID } = require('../../libs/data/services.js');
let { createFindPracticesMsg, createViewPracticePromosMsg } = require('../../libs/services/description.js');

let getServiceDescription = async ({ query, params }, res) => {
  let { show_practices } = params;
  let { service_id, practice_id } = query;
  
  let service = await getServiceByID(
    { service_id }
  );

  if (show_practices === 'no') {
    let msg = createViewPracticePromosMsg(
      { service_id, service, practice_id }
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