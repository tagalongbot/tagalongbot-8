let { getProviderByID } = require('../../../libs/data/providers.js');
let { getServiceByID } = require('../../../libs/data/services.js');
let { getServicePromos, createNoPromosMsg } = require('../../../libs/services/provider/promos.js');
let { toGalleryElement } = require('../../../libs/promos/promos.js');
let { createMultiGallery } = require('../../../libs/bots.js');

let getServiceProviderPromos = async ({ query }, res) => {
  let { messenger_user_id, first_name, last_name, gender, service_id, provider_id, provider_base_id } = query;

  let provider = await getProviderByID(provider_id);
  let provider_name = provider.fields['Practice Name'];
  
  let service = await getServiceByID({ service_id });
  let service_name = service.fields['Name'];

  let promos = await getServicePromos({ service_name, provider_base_id });

  if (!promos[0]) {
    let messages = createNoPromosMsg({ first_name, service_name, provider_id, provider_name });
    res.send({ messages });
    return;
  }

  let galleryData = promos.map(
    toGalleryElement({ provider_id, provider_base_id, first_name, last_name, gender, messenger_user_id })
  );

  let text = `Here are some ${service_name} promos by ${provider_name}`;
  let messages = [
    { text },
    ...createMultiGallery(galleryData)
  ];

  res.send({ messages });
}

module.exports = getServiceProviderPromos;