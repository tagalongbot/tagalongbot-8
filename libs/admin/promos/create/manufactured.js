let { BASEURL } = process.env;

let { createURL, localizeDate } = require('../../../../libs/helpers.js');
let { createBtn } = require('../../../../libs/bots.js');

let { getServiceByID } = require('../../../../libs/data/services.js');
let { getManufacturedPromoByID, getManufacturedPromos, getManufacturedPromosByService } = require('../../../../libs/data/manufactured-promos.js');

let { createExpirationDate } = require('../../../../libs/admin/promos/create.js');
let { createPracticePromo } = require('../../../../libs/data/practice/promos.js');

let getServicesWithPromos = async ({ services }) => {
  let manufactured_promos = await getManufacturedPromos();
  let all_manufactured_service_name = manufactured_promos.map(
    promo => promo.fields['Service Name'].toUpperCase()
  );

  let manufacutred_promo_service_names = [...new Set(all_manufactured_service_name)];

  let services_with_promos = services.filter(
    service => manufacutred_promo_service_names.includes(service.fields['Name'].toUpperCase())
  );
  
  return services_with_promos;
}

let createNewPromo = async (data) => {
  let { new_promo_id, new_promo_practice_promos_base_id, new_promo_service_id, new_promo_expiration_date, new_promo_claim_limit } = data;

  let service = await getServiceByID({ service_id: new_promo_service_id });

  let manufactured_promo = await getManufacturedPromoByID({ promo_id: new_promo_id });
  let new_promo_type = manufactured_promo.fields['Name'];

  let new_promo_image = manufactured_promo.fields['Image URL'];
  let expiration_date = createExpirationDate(new_promo_expiration_date);

  let promo_data = {
    ['Promotion Name']: `${new_promo_type} on ${service.fields['Name']}`,
    ['Type']: `${service.fields['Name']}-${new_promo_type.trim().toLowerCase()}`,
    ['Active?']: true,
    ['Details']: manufactured_promo.fields['Details'],
    ['Expiration Date']: localizeDate(expiration_date),
    ['Image URL']: new_promo_image,
    ['Claim Limit']: Number(new_promo_claim_limit.trim()),
    ['Total Claim Count']: 0,
    ['Total Used']: 0,
  }

  console.log('new_promo_practice_promos_base_id', new_promo_practice_promos_base_id);
  let newPromo = await createPracticePromo({ practice_promos_base_id: new_promo_practice_promos_base_id, promo_data });

  return newPromo;
}

// Mapping Functions
let toServicesGallery = ({ practice_id, practice_promos_base_id }) => ({ id: service_id, fields: service }) => {
  let title = service['Name'];
  let image_url = service['Image URL'];

  let view_service_promos_url = createURL(
    `${BASEURL}/admin/promos/create/manufactured/service`,
    { service_id, practice_id, practice_promos_base_id }
  );

  let btn = createBtn(`View Service Promos|json_plugin_url|${view_service_promos_url}`);

  let buttons = [btn];

  let element = { title, image_url, buttons };
  return element;
}

let toPromosGallery = ({ practice_id, practice_promos_base_id, service_id }) => ({ id: promo_id, fields: promo }) => {
  let title = `${promo['Name']} on ${promo['Service Name']}`;
  let image_url = promo['Image URL'];

  let create_promo_url = createURL(
    `${BASEURL}/admin/promos/create/manufactured/service/create`,
    { service_id, promo_id, practice_id, practice_promos_base_id }
  );

  let view_promo_details_url = createURL(
    `${BASEURL}/admin/promos/view/manufactured/details`,
    { service_id, promo_id, practice_id, practice_promos_base_id }
  );

  let btn1 = createBtn(`Create Promo|json_plugin_url|${create_promo_url}`);
  let btn2 = createBtn(`View Promo Details|json_plugin_url|${view_promo_details_url}`);

  let buttons = [btn1, btn2];

  let element = { title, image_url, buttons };
  return element;
}

module.exports = {
  getServicesWithPromos,
  createNewPromo,
  toServicesGallery,
  toPromosGallery,
}