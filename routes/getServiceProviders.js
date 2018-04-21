let { BASEURL, SERVICES_BASE_ID, PRACTICE_DATABASE_BASE_ID } = process.env;
let { createGallery } = require('../libs/bots');
let { getTable, findTableData, getAllDataFromTable } = require('../libs/data');

let getServicesTable = getTable('Services');
let servicesTable = getServicesTable(SERVICES_BASE_ID);
let findService = findTableData(servicesTable);

let getPracticeTable = getTable('Practices');
let practiceTable = getPracticeTable(PRACTICE_DATABASE_BASE_ID);
let getPractices = getAllDataFromTable(practiceTable);

let toGalleryElement = (provider) => {
  let title = provider.practice_name.slice(0, 80);
  let subtitle = `${provider.first_name} ${provider.last_name} | ${provider.address}`;
  let image_url = provider.practice_panel_photo_uri;

  let btn1 = {
    title: 'View Services',
    type: 'json_plugin_url',
    url: `${BASEURL}/provider/services?provider_id=${provider.providerid}&provider_name=${encodeURIComponent(provider.practice_name)}`
  }

  let btn2 = {
    title: 'View Promos',
    type: 'json_plugin_url',
    url: `${BASEURL}/provider/promos?provider_id=${provider.providerid}&provider_name=${encodeURIComponent(provider.practice_name)}`
  }

  let buttons = [btn1, btn2];

  let element = { title, subtitle, image_url, buttons};
  return element;
}

let searchProviders = () => {
  let filterByFormula = ``;
}

let getServiceProviders = async ({ query }, res) => {
  let { service_id } = query;

  let service = await findService(service_id);

  let activeProviders = await getActiveProviders();

  let matchedProviders = activeProviders.filter((provider) => service.providerid === provider.providerid);

  if (!matchedProviders[0]) {
    let redirect_to_blocks = ['No Providers Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let providersGalleryData = matchedProviders.map(toGalleryElement);
  let providersGallery = createGallery(providersGalleryData);
  let messages = [providersGallery];
  res.send({ messages });
}

module.exports = getServiceProviders;