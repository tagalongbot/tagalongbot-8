let { getProviderByID } = require('../../libs/providers.js');
let { findService } = require('../../libs/services.js');
let { createFindProvidersMsg, createViewProviderPromosMsg } = require('../../libs/services/description.js');

let getServiceDescription = async ({ query, params }, res) => {
  let { show_providers } = params;
  let { messenger_user_id, first_name, last_name, gender, service_id, provider_id, provider_base_id } = query;

  if (show_providers === 'no') {
    let provider = await getProviderByID(provider_id);
    let provider_name = provider.fields['Practice Name'];    
    let messages = createViewProviderPromosMsg(
      service,
      { messenger_user_id, first_name, last_name, gender, service_id, provider_id, provider_base_id, provider_name }
    );

    res.send({ messages });
  }

  let service = await findService(service_id);
  let service_name = service.fields['Name'];

  let messages = createFindProvidersMsg({ service, service_id });
  res.send({ messages });
}

module.exports = getServiceDescription;