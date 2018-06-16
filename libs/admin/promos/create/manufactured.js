let { BASEURL, SERVICES_BASE_ID, SURGICAL_SERVICES_IMAGE_URL } = process.env;
let { createURL, localizeDate } = require('../../../../libshelpers.js');
let { createBtn } = require('../../../../libs/bots.js');
let { getTable, createTableData } = require('../../../../libs/data.js');

let { getAllServics, findService } = require('../../../../libs/services.js');
let { getManufacturedPromos, getManufacturedPromosByService } = require('../../../../libs/data/manufactured-promos.js');

let getPromosTable = getTable('Promos');

let getProviderServices = async (provider) => {
  let services = await getAllServics();

  let provider_services = provider.fields['Practice Services'].map(
    service => service.toLowerCase()
  );

  let matched_services = services.filter(
    (service) => provider_services.includes(service.fields['Name'].toLowerCase())
  );

  return matched_services;
}

let getServicePromos = (service) => {
  let service_keys = Object.keys(service.fields);

  let promos = service_keys.filter(
    (key) => key.toLowerCase().startsWith('promo-')
  );

  return promos;
}

let getServicesWithPromos = async (services) => {
  let manufactured_promos = await getManufacturedPromos();
  let all_manufactured_service_name = manufactured_promos.map(promo => promo.fields['Service Name'].toUpperCase());
  let manufacutred_promo_service_names = [...new Set(all_manufactured_service_name)];

  let services_with_promos = services.filter(
    service => manufacutred_promo_service_names.includes(service.fields['Name'].toUpperCase())
  );

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

  let service_types_length = getServicePromos(service).length;
  let subtitle = `Promo Types Available: ${service_types_length}`;
  let image_url = service['Image URL'];

  let view_service_promos_url = createURL(
    `${BASEURL}/promo/new/manufactured/service`, 
    { service_id, provider_id, provider_base_id }
  );

  let btn = createBtn(`View Service Promos|json_plugin_url|${view_service_promos_url}`);

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
    `${BASEURL}/admin/promos/create/manufactured/service/create`,
    { service_id, service_name, provider_id, provider_base_id, promo_type }
  );
  
  let btn = createBtn(`Create Promo|json_plugin_url|${create_promo_url}`);

  let buttons = [btn];

  let element = { title, image_url, buttons };
  return element;
}

module.exports = {
  getProviderServices,
  getServicePromos,
  getServicesWithPromos,
  createNewPromo,
  toServicesGallery,
  toPromosGallery,
}