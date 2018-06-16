let { BASEURL, SERVICES_BASE_ID, SURGICAL_SERVICES_IMAGE_URL } = process.env;
let { createURL, localizeDate } = require('../../../../libs/helpers.js');
let { createBtn } = require('../../../../libs/bots.js');
let { getTable, createTableData } = require('../../../../libs/data.js');

let { getAllServices, findService } = require('../../../../libs/services.js');
let { getManufacturedPromos, getManufacturedPromosByService } = require('../../../../libs/data/manufactured-promos.js');

let getPromosTable = getTable('Promos');

let getProviderServices = async ({ provider }) => {
  let services = await getAllServices();

  let provider_services = provider.fields['Practice Services'].map(
    service => service.toLowerCase()
  );

  let matched_services = services.filter(
    (service) => provider_services.includes(service.fields['Name'].toLowerCase())
  );

  return matched_services;
}

let getServicesWithPromos = async ({ services }) => {
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
let toServicesGallery = ({ provider_id, provider_base_id, total_service_promos_available }) => ({ id: service_id, fields: service }) => {
  let title = service['Name'];

  let subtitle = `Promo Types Available: ${total_service_promos_available}`;
  let image_url = service['Image URL'];

  let view_service_promos_url = createURL(
    `${BASEURL}/admin/promos/create/manufactured/service`,
    { service_id, provider_id, provider_base_id }
  );

  let btn = createBtn(`View Service Promos|json_plugin_url|${view_service_promos_url}`);

  let buttons = [btn];

  let element = { title, subtitle, image_url, buttons };
  return element;
}

let toPromosGallery = ({ provider_id, provider_base_id, service_id }) => ({ id: promo_id, fields: promo }) => {
  let title = `${promo['Name']} on ${promo['Service Name']}`;
  let image_url = promo['Image URL'];

  let create_promo_url = createURL(
    `${BASEURL}/admin/promos/create/manufactured/service/create`,
    { service_id, promo_id, provider_id, provider_base_id }
  );

  let view_promo_details_url = createURL(
    `${BASEURL}/admin/promos/view/manufactured/details`,
    { service_id, promo_id, provider_id, provider_base_id }
  );

  let btn1 = createBtn(`Create Promo|json_plugin_url|${create_promo_url}`);
  let btn2 = createBtn(`View Promo Details|json_plugin_url|${view_promo_details_url}`);

  let buttons = [btn1, btn2];

  let element = { title, image_url, buttons };
  return element;
}

module.exports = {
  getProviderServices,
  getServicesWithPromos,
  createNewPromo,
  toServicesGallery,
  toPromosGallery,
}