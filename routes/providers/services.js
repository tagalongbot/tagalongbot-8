let { getProviderByID } = require('../../libs/data/providers.js');
let { getServices, filterServicesFromProvider } = require('../../libs/data/services.js');
let { toGalleryElement } = require('../../libs/providers/services.js');
let { createMultiGallery } = require('../../libs/bots.js');

let getProviderServices = async ({ query }, res) => {
  let { provider_id, provider_base_id, first_name, last_name, gender, messenger_user_id } = query;

  let provider = await getProviderByID(provider_id);
  let provider_name = provider.fields['Practice Name'];
  let services = await getServices();

  let services_from_provider = filterServicesFromProvider({ services, provider });

  if (!services_from_provider[0]) {
    let redirect_to_blocks = ['No Provider Services Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let servicesGalleryData = services_from_provider.slice(0, 9).map(
    toGalleryElement({ messenger_user_id, first_name, last_name, gender, provider_id, provider_base_id, provider_name })
  );

  let servicesGallery = createMultiGallery(servicesGalleryData, 10, 'square');
  let text = `Here are the services provided by ${provider_name}`;
  let messages = [{ text }, ...servicesGallery];
  res.send({ messages });
}

module.exports = getProviderServices;