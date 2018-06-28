let { getPracticeByID } = require('../../libs/data/practices.js');
let { getServiceByID } = require('../../libs/data/services.js');
let { createFindProvidersMsg, createViewProviderPromosMsg } = require('../../libs/services/description.js');

let getServiceDescription = async ({ query, params }, res) => {
  let { show_providers } = params;
  let { messenger_user_id, first_name, last_name, gender, service_id, practice_id, practice_base_id } = query;

  let service = await getServiceByID({ service_id });
  let service_name = service.fields['Name'];

  if (show_providers === 'no') {
    let practice = await getProviderByID(provider_id);
    let practice_name = practice.fields['Practice Name'];    

    let msg = createViewProviderPromosMsg(
      service,
      { messenger_user_id, first_name, last_name, gender, service_id, practice_id, practice_base_id, practice_name }
    );

    let messages = [msg];
    res.send({ messages });
    return;
  }

  let msg = createFindProvidersMsg(
    { service, service_id, messenger_user_id, first_name, last_name, gender }
  );

  let messages = [msg];
  res.send({ messages });
}

module.exports = getServiceDescription;