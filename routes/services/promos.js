let { flattenArray, shuffleArray } = require('../../libs/helpers.js');
let { findService } = require('../../libs/data/services.js');
let { getAllProviders, filterProvidersByService } = require('../../libs/data/providers.js');
let { getPracticePromos } = require('../../libs/data/practice/promos.js');
let { toGalleryElement } = require('../../libs/promos/promos.js');
let { createGallery } = require('../../libs/bots.js');

let getServicePromos = async ({ query }, res) => {
  let { service_id, messenger_user_id, first_name, last_name, gender } = query;
  
  let service = await findService(service_id);
  let service_name = service.fields['Name'];

  let providers = await getAllProviders();
  let providers_with_service = filterProvidersByService(service_name, providers);

  let provider_promos = providers_with_service.map(async provider => {
    let provider_id = provider.id;
    let provider_base_id = provider.fields['Practice Base ID'];
    let promos = await getPracticePromos({ provider_base_id });
    return promos.map(
      toGalleryElement({ provider_id, provider_base_id, first_name, last_name, gender, messenger_user_id })
    );
  });
  
  let promos = flattenArray(
    await Promise.all(provider_promos)
  );
  
  let randomPromos = shuffleArray(promos).slice(0, 10);
  
  let gallery = createGallery(randomPromos, 10, 'square');
  let messages = [gallery]
  res.send({ messages });
}

module.exports = getServicePromos;