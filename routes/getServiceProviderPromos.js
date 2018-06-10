let { BASEURL, PRACTICE_DATABASE_BASE_ID } = process.env;
let { createURL } = require('../libs/helpers');
let { toGalleryElement } = require('../libs/promos');
let { createMultiGallery, createButtonMessage } = require('../libs/bots');
let { getTable, getAllDataFromTable, findTableData } = require('../libs/data');

let getPracticesTable = getTable('Practices');
let practicesTable = getPracticesTable(PRACTICE_DATABASE_BASE_ID);
let findPractice = findTableData(practicesTable);
let getPromosTable = getTable('Promos');

let getPromos = async ({ service_name, provider_base_id }) => {
  let promosTable = getPromosTable(provider_base_id);
  let getPromosFromTable = getAllDataFromTable(promosTable);
  let view = 'Active Promos';
  let promos = await getPromosFromTable({ view });
  let matched_promos = promos.filter(
    promo => promo.fields['Type'].toLowerCase().includes(service_name)
  );

  return matched_promos;
}

let createNoPromosMsg = async (data) => {
  let { first_name } = data;
  let view_services_btn_url = createURL(`${BASEURL}/provider/services`, data);

  let msg = createButtonMessage(
    `Sorry ${first_name} looks like this provider does not have any promotions for this service at the moment`,
    `View Services Again|json_plugin_url|${view_services_btn_url}`
  );

  return [msg];
}

let getServiceProviderPromos = async ({ query }, res) => {
  let { service_name, provider_id, provider_base_id } = query;

  let provider = await findPractice(provider_id);
  let provider_name = provider.fields['Practice Name'];
  let promos = await getPromos({ service_name, provider_base_id });

  if (!promos[0]) {
    let messages = createNoPromosMsg(query);
    res.send({ messages });
    return;
  }

  let galleryData = promos.map(toGalleryElement(query));
  let text = `Here are some ${service_name} promos by ${provider_name}`;
  let messages = [{ text }, ...createMultiGallery(galleryData)];
  res.send({ messages });
}

module.exports = getServiceProviderPromos;