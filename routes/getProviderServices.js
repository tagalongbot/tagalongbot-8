let { BASEURL } = process.env;
let { createGallery } = require('../libs/bots');
let { getServices, getProviderServices } = require('../libs/data');

let toGalleryElement = (provider_name) => (service) => {
  let title = service.service_name;
  let subtitle = `Service provided by ${provider_name}`.slice(0, 80);
  let image_url = service.service_photo_uri;

  let btn1 = {
    title: 'Read Description',
    type: 'json_plugin_url',
    url: `${BASEURL}/service/description?service_id=${service.serviceid}`
  }

  let buttons = [btn1];
  
  let element = { title, subtitle, image_url, buttons };
  return element;
}

let getProviderListOfServices = async ({ query }, res) => {
  let { provider_id, provider_name } = query;

  let providerServices = await getProviderServices();
  let servicesFromProvider = providerServices
    .filter((service) => service.providerid === Number(provider_id))
    .map(service => service.serviceid);

  let services = await getServices();
  let matchedServices = services
    .filter(service => servicesFromProvider.includes(service.serviceid));

  let servicesGalleryData = matchedServices.map(toGalleryElement(provider_name));
  let servicesGallery = createGallery(servicesGalleryData);
  let messages = [servicesGallery];
  res.send({ messages });
}

module.exports = getProviderListOfServices;