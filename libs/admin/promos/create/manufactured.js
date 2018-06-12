let { BASEURL, SERVICES_BASE_ID, SURGICAL_SERVICES_IMAGE_URL } = process.env;
let { createURL, localizeDate } = require('../libs/helpers');

let { getTable, getAllDataFromTable, findTableData, createTableData } = require('../libs/data');

let getServicesTable = getTable('Services');
let servicesTable = getServicesTable(SERVICES_BASE_ID);
let getServicesFromTable = getAllDataFromTable(servicesTable);
let findService = findTableData(servicesTable);

let getPromosTable = getTable('Promos');

let getProviderServices = async (provider) => {
  let view = 'Main View';
  let services = await getServicesFromTable({ view });

  let provider_services = provider.fields['Practice Services'].map(
    service => service.toLowerCase()
  );

  let matched_services = services.filter(
    (service) => provider_services.includes(service.fields['Name'].toLowerCase())
  );

  return matched_services;
}

let getServicePromosCount = (service) => {
  let service_keys = Object.keys(service);

  let promo_keys = service_keys.filter(
    key => key.toLowerCase().startsWith('promo-')
  );

  return promo_keys.length;
}

let getServicePromos = (service) => {
  let promos = Object.keys(service.fields)

  .filter(
    (key) => key.toLowerCase().startsWith('promo-')
  );

  return promos;
}

let getServicesWithPromos = (services) => {
  let services_with_promos = services.filter((service) => {
    let promos_count = getServicePromosCount(service.fields);
    return promos_count > 0;
  });
  
  return services_with_promos;
}

let createNewPromo = async (data) => {
  let { 
    new_promo_provider_base_id, 
    new_promo_service_id, 
    new_promo_type, 
    new_promo_expiration_date, 
    new_promo_claim_limit 
  } = data;

  let promosTable = getPromosTable(new_promo_provider_base_id);
  let createPromo = createTableData(promosTable);

  let service = await findService(new_promo_service_id);

  let new_promo_image = service.fields[`Promo-${new_promo_type}`];
  let expiration_date = new Date(new_promo_expiration_date);

  let promoData = {
    ['Promotion Name']: `${new_promo_type} on ${service.fields['Name']}`,
    ['Type']: `${service.fields['Name']}-${new_promo_type.trim().toLowerCase()}`,
    ['Active?']: true,
    ['Terms']: `Valid Until ${localizeDate(expiration_date)}`,
    ['Expiration Date']: expiration_date,
    ['Image URL']: new_promo_image,
    ['Claim Limit']: Number(new_promo_claim_limit.trim()),
    ['Total Claim Count']: 0,
    ['Total Used']: 0,
  }

  let newPromo = await createPromo(promoData);

  return newPromo;
}

// Mapping Functions
let toServicesGallery = ({ provider_id, provider_base_id }) => ({ id: service_id, fields: service }) => {
  let title = service['Name'];

  let service_types_length = getServicePromosCount(service);
  let subtitle = `Promo Types Available: ${service_types_length}`;
  let image_url = service['Image URL'];

  let view_service_promos_url = createURL(
    `${BASEURL}/promo/new/manufactured/service`, 
    { service_id, provider_id, provider_base_id }
  );

  let btn = {
    title: 'View Service Promos',
    type: 'json_plugin_url',
    url: view_service_promos_url
  }

  let buttons = [btn];

  let element = { title, subtitle, image_url, buttons };
  return element;
}

let toPromosGallery = ({ provider_id, provider_base_id }, { id: service_id, fields: service }) => ({ id: promo_id, fields: promo }) => {
  let promo_name = promo['Promotion Name'];
  let promo_type = promo_name.slice(6);
  let title = promo_type;
  let image_url = service[promo_name];

  let service_name = service['Name'];

  let create_promo_url = createURL(
    `${BASEURL}/promo/new/manufactured/service/create`,
    { service_id, service_name, provider_id, provider_base_id, promo_type }
  );

  let btn = {
    title: 'Create Promo',
    type: 'json_plugin_url',
    url: create_promo_url
  }

  let buttons = [btn];

  let element = { title, image_url, buttons };
  return element;
}

module.exports = {
  getProviderServices,
  getServicePromosCount,
  getServicePromos,
  getServicesWithPromos,
  createNewPromo,
  toServicesGallery,
  toPromosGallery,
}