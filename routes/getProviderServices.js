let { BASEURL, PRACTICE_DATABASE_BASE_ID, SERVICES_BASE_ID } = process.env;
let { createGallery } = require('../libs/bots');
let { createURL } = require('../libs/helpers');
let { getTable, getAllDataFromTable, findTableData } = require('../libs/data');

let getPracticeTable = getTable('Practices');
let practiceTable = getPracticeTable(PRACTICE_DATABASE_BASE_ID);
let findPractice = findTableData(practiceTable);

let getServicesTable = getTable('Services');
let servicesTable = getServicesTable(SERVICES_BASE_ID);
let getServices = getAllDataFromTable(servicesTable);

let toGalleryElement = (data) => ({ id: service_id, fields: service }) => {
  let title = service['Name'];
  let subtitle = `Service provided by ${decodeURIComponent(data.provider_name)}`.slice(0, 80);
  let image_url = service['Image URL'];

  let service_name = encodeURIComponent(service['Name']);
  let read_description_btn_url = createURL(`${BASEURL}/service/description/no`, { service_id, service_name, ...data });
  let btn = {
    title: 'Read Description',
    type: 'json_plugin_url',
    url: read_description_btn_url,
  }

  let buttons = [btn];

  let element = { title, subtitle, image_url, buttons };
  return element;
}

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