let { getServices, getProviderServices } = require('../libs/data');

let getProviderListOfServices = async ({ query }, res) => {
  let { provider_id } = query;

  let providerServices = await getProviderServices();
  let servicesFromProvider = providerServices
    .filter((service) => service.providerid === provider_id)
    .map(service => service.serviceid);
  
  
}

module.exports = getProviderListOfServices;