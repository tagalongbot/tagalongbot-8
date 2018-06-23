let { getProviderByID } = require('../../libs/data/providers.js');
let { getServiceByID } = require('../../libs/data/services.js');
let { createFindProvidersMsg, createViewProviderPromosMsg } = require('../../libs/services/description.js');

let getServiceDescription = async ({ query, params }, res) => {
  let { show_providers } = params;
  let { messenger_user_id, first_name, last_name, gender, service_id, provider_id, provider_base_id } = query;

  let service = await getServiceByID({ service_id });
  let service_name = service.fields['Name'];

  if (show_providers === 'no') {
    let provider = await getProviderByID(provider_id);
    let provider_name = provider.fields['Practice Name'];    

    let messages = createViewProviderPromosMsg(
      service,
      { messenger_user_id, first_name, last_name, gender, service_id, provider_id, provider_base_id, provider_name }
    );

    res.send({ messages });
    return;
  }

  let messages = createFindProvidersMsg(
    { service, service_id, messenger_user_id, first_name, last_name, gender }
  );

  res.send({ messages });
}

module.exports = getServiceDescription;