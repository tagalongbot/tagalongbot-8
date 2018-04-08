let { createTextMessage } = require('../libs/bots');
let { getServices, getProviderServices } = require('../libs/data');

let getServiceDescription = async ({ query }, res) => {
  let { service_id } = query;

  let services = await getServices();
  let service = services
    .find((service) => service.serviceid === Number(service_id));

  let txtMsg = createTextMessage(service.long_description);
  let messages = [txtMsg];
  res.send({ messages });
}

module.exports = getServiceDescription;