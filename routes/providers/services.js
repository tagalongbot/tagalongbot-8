let { getProviderByID } = require('../../libs/data/practices.js);
let { getAllServices, filterServicesFromProvider } = require('../../libs/data/services.js');
let { toGalleryElement } = require('../../libs/providers/services.js');
let { createMultiGallery } = require('../../libs/bots.js');

let getProviderServices = async ({ query }, res) => {
  let { practice_id, practice_base_id, first_name, last_name, gender, messenger_user_id } = query;

  let practice = await getProviderByID(provider_id);
  let practice_name = practice.fields['Practice Name'];
  let services = await getAllServices();

  let services_from_provider = filterServicesFromProvider({ services, practice });

  if (!services_from_provider[0]) {
    let redirect_to_blocks = ['No Provider Services Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let servicesGalleryData = services_from_provider.slice(0, 9).map(
    toGalleryElement({ messenger_user_id, first_name, last_name, gender, practice_id, practice_base_id, practice_name })
  );

  let servicesGallery = createMultiGallery(servicesGalleryData, 10, 'square');
  let text = `Here are the services provided by ${practice_name}`;
  let messages = [{ text }, ...servicesGallery];
  res.send({ messages });
}

module.exports = getProviderServices;