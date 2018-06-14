let { findService } = require('../../libs/services.js');
let { createFindProvidersMsg, createViewProviderPromosMsg } = require('../../libs/services/description.js');

let getServiceDescription = async ({ query, params }, res) => {
  let { show_providers } = params;
  let { service_id, provider_id, provider_base_id } = query;

  let service = await findService(service_id);

  let messages = (show_providers === 'no') ? createViewProviderPromosMsg(service, query) : createFindProvidersMsg(service);
  res.send({ messages });
}

module.exports = getServiceDescription;