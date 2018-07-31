let { getPracticeByID } = require('../../libs/data/practices.js');
let { getServiceByID } = require('../../libs/data/services.js');

let { createFindPracticesMsg } = require('../../libs/services/description.js');

let getServiceDescription = async ({ query, params }, res) => {
  let { service_id, practice_id } = query;

  let service = await getServiceByID(
    { service_id }
  );

  let msg = createFindPracticesMsg(
    { service }
  );

  let messages = [msg];

  res.send({ messages });
}

module.exports = getServiceDescription;