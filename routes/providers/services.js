let { createGallery } = require('../../libs/bots.js');
let { getProviderByID } = require('../../libs/providers.js');
let { getServices, filterServicesFromProvider } = require('../../libs/services.js');
let { toGalleryElement } = require('../../libs/providers/services.js');

let getProviderServices = async ({ query }, res) => {
  let { provider_id, messenger_user_id, first_name, last_name, gender } = query;

  let provider = await getProviderByID(provider_id);
  let provider_name = provider.fields['Practice Name'];
  let provider_base_id = provider.fields['Practice Base ID'];
  let services = await getServices();

  let services_from_provider = filterServicesFromProvider();

  if (!services_from_provider[0]) {
    let redirect_to_blocks = ['No Provider Services Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let servicesGalleryData = services_from_provider.slice(0, 9).map(
    toGalleryElement({ messenger_user_id, first_name, last_name, gender, provider_id, provider_base_id, provider_name })
  );

  let servicesGallery = createGallery(servicesGalleryData);
  let text = `Here are the services provided by ${provider.fields['Practice Name']}`;
  let messages = [{ text }, servicesGallery];
  res.send({ messages });
}

module.exports = getProviderServices;