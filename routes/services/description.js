let { getProviderByID } = require('../../libs/providers.js');
let { findService } = require('../../libs/services.js');
let { createFindProvidersMsg, createViewProviderPromosMsg } = require('../../libs/services/description.js');

let getServiceDescription = async ({ query, params }, res) => {
  let { show_providers } = params;
  let { service_id, messenger_user_id, first_name, last_name, gender, provider_id, provider_base_id } = query;

  let provider = await getProviderByID(provider_id);
  let provider_name = provider.fields['Practice Name'];

  let service = await findService(service_id);
  let service_name = service.fields['Name'];
  
  let view_provider_promos_data = { messenger_user_id, first_name, last_name, gender, service_id, provider_id, provider_base_id, provider_name };

  let messages = (show_providers === 'no') ? createViewProviderPromosMsg(service, view_provider_promos_data) : createFindProvidersMsg(service);
  res.send({ messages });
}

module.exports = getServiceDescription;