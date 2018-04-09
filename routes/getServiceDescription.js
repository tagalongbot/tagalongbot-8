let { BASEURL } = process.env;
let { createButtonMessage } = require('../libs/bots');
let { getServices, getProviderServices } = require('../libs/data');

let getServiceDescription = async ({ query }, res) => {
  let { service_id } = query;

  let services = await getServices();
  let service = services
    .find((service) => service.serviceid === Number(service_id));

  let txtMsg = createButtonMessage(
    service.long_description,
    `Find Providers|json_plugin_url|${BASEURL}/service/providers?service_id=${service_id}`
  );
  
  let messages = [txtMsg];
  res.send({ messages });
}

module.exports = getServiceDescription;