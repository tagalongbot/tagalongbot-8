let { BASEURL, SERVICES_BASE_ID } = process.env;
let { createGallery } = require('../libs/bots');
let { createURL } = require('../libs/helpers');
let { getTable, getAllDataFromTable, findTableData } = require('../libs/data');

let getServicesTable = getTable('Services');
let servicesTable = getServicesTable(SERVICES_BASE_ID);
let getServices = getAllDataFromTable(servicesTable);

let getProviderServices = async ({ query }, res) => {
  let { provider_id } = query;
  let { messenger_user_id, first_name, last_name, gender } = query;

  let provider = await findPractice(provider_id);
  let provider_name = provider.fields['Practice Name'];
  let provider_base_id = provider.fields['Practice Base ID'];
  let services = await getServices();

  let servicesFromProvider = services.filter((service) => {
    return provider.fields['Practice Services'].map(service => service.toLowerCase()).includes(service.fields['Name'].toLowerCase())
  });

  if (!servicesFromProvider[0]) {
    let redirect_to_blocks = ['No Provider Services Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let text = `Here are the services provided by ${provider.fields['Practice Name']}`;

  let data = { messenger_user_id, first_name, last_name, gender, provider_id, provider_base_id, provider_name };
  let servicesGalleryData = servicesFromProvider.slice(0, 9).map(toGalleryElement(data));
  let servicesGallery = createGallery(servicesGalleryData);
  let messages = [{ text }, servicesGallery];
  res.send({ messages });
}

module.exports = getProviderServices;