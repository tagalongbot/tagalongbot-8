let { getServiceByID } = require('../../../libs/data/services.js');

let { createViewPracticePromosMsg } = require('../../../libs/practices/service/description.js');

let getPracticeServiceDescription = async ({ query }, res) => {
  let { service_id, practice_id } = query;

  let service = await getServiceByID(
    { service_id }
  );

  let msg = createViewPracticePromosMsg({ service, service_id, practice_id });
  
  let messages = [msg];

  res.send({ messages });
}

module.exports = getPracticeServiceDescription;