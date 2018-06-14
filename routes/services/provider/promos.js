let { BASEURL, PRACTICE_DATABASE_BASE_ID } = process.env;
let { createURL } = require('../../../libs/helpers.js');
let { toGalleryElement } = require('../../../libs/promos.js');
let { createMultiGallery, createButtonMessage } = require('../../../libs/bots.js');

let getServiceProviderPromos = async ({ query }, res) => {
  let { service_name, provider_id, provider_base_id } = query;

  let provider = await getProviderByID(provider_id);
  let provider_name = provider.fields['Practice Name'];

  let promos = await getPromos({ service_name, provider_base_id });

  if (!promos[0]) {
    let messages = createNoPromosMsg(query);
    res.send({ messages });
    return;
  }

  let galleryData = promos.map(
    toGalleryElement(query)
  );

  let text = `Here are some ${service_name} promos by ${provider_name}`;
  let messages = [{ text }, ...createMultiGallery(galleryData)];
  res.send({ messages });
}

module.exports = getServiceProviderPromos;