let { createGallery } = require('../libs/bots'); 
let { getServices, getProviderServices } = require('../libs/data');

let toGalleryElement = (provider_name) => (service) => {
  let title = service.service_name;
  let subtitle = `Service provided by ${provider_name}`.slice(0, 80);
  let image_url = service.service_photo_uri;
  

}

let getProviderListOfServices = async ({ query }, res) => {
  let { provider_id } = query;

  let providerServices = await getProviderServices();
  let servicesFromProvider = providerServices
    .filter((service) => service.providerid === Number(provider_id))
    .map(service => service.serviceid);
  
  let services = await getServices();
  let matchedServices = services
    .filter(service => servicesFromProvider.includes(service.serviceid));
  
  res.send(matchedServices);
}

module.exports = getProviderListOfServices;