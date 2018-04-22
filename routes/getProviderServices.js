let { BASEURL, PRACTICE_DATABASE_BASE_ID, SERVICES_BASE_ID } = process.env;
let { createGallery } = require('../libs/bots');
let { createB } = require('../libs/bots');
let { getTable, getAllDataFromTable, findTableData } = require('../libs/data');

let getPracticeTable = getTable('Practices');
let practiceTable = getPracticeTable(PRACTICE_DATABASE_BASE_ID);
let findPractice = findTableData(practiceTable);

let getServicesTable = getTable('Services');
let servicesTable = getServicesTable(SERVICES_BASE_ID);
let getServices = getAllDataFromTable(servicesTable);

let toGalleryElement = (provider_name) => ({ id: service_id, fields: service }) => {
  let title = service['Name'];
  let subtitle = `Service provided by ${provider_name}`.slice(0, 80);
  let image_url = service['Image URL'];

  let btn1 = {
    title: 'Read Description',
    type: 'json_plugin_url',
    url: `${BASEURL}/service/description?service_id=${service_id}&service_name=${encodeURIComponent(service['Name'])}`
  }

  let buttons = [btn1];
  
  let element = { title, subtitle, image_url, buttons };
  return element;
}

let getProviderListOfServices = async ({ query }, res) => {
  let { provider_id, provider_name } = query;

  let provider = await findPractice(provider_id);
  let services = await getServices();

  let servicesFromProvider = services
    .filter((service) => provider.fields['Practice Services'].includes(service.fields['Name']));

  if (!servicesFromProvider[0]) {
    let redirect_to_blocks = ['No Provider Services Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let servicesGalleryData = servicesFromProvider.map(toGalleryElement(provider_name));
  let servicesGallery = createGallery(servicesGalleryData);
  let messages = [servicesGallery];
  res.send({ messages });
}

module.exports = getProviderListOfServices;