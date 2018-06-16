let { findService } = require('../../libs/services.js');
let { createFindProvidersMsg, createViewProviderPromosMsg } = require('../../libs/services/description.js');

let getServiceDescription = async ({ query, params }, res) => {
  let { show_providers } = params;
  let { messenger_user_id, first_name, last_name, gender } = query;
  let { service_id, provider_id, provider_base_id, provider_name } = query;

  let service = await findService(service_id);
  let service_name = service.fields['Name'];
  
  let view_provider_promos_data = { messenger_user_id, first_name, last_name, gender, service_id, provider_id, provider_base_id, provider_name };

  let messages = (show_providers === 'no') ? createViewProviderPromosMsg(service, { provider_id, provider_base_id }) : createFindProvidersMsg(service);
  res.send({ messages });
}

module.exports = getServiceDescription;