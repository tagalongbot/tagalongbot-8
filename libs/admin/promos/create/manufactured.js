let { localizeDate } = require('../../../../libs/helpers.js');
let { createBtn } = require('../../../../libs/bots.js');

let { getServiceByID } = require('../../../../libs/data/services.js');
let { getManufacturedPromoByID, getManufacturedPromos, getManufacturedPromosByService } = require('../../../../libs/data/manufactured-promos.js');

let { createPracticePromo } = require('../../../../libs/data/practice/promos.js');

let getServicesWithPromos = async ({ services }) => {
  let manufactured_promos = await getManufacturedPromos();

  let all_manufactured_service_name = manufactured_promos.map(
    promo => promo.fields['Service Name'].toUpperCase()
  );

  let manufacutred_promo_service_names = [
    ...new Set(all_manufactured_service_name)
  ];

  let services_with_promos = services.filter(
    service => manufacutred_promo_service_names.includes(service.fields['Name'].toUpperCase())
  );
  
  return services_with_promos;
}

let createNewPromo = async (data) => {
  let { promo_id, practice_promos_base_id, service_id, expiration_date, claim_limit } = data;

  let service = await getServiceByID(
    { service_id }
  );
  
  let service_name = service.fields['Name'];

  let manufactured_promo = await getManufacturedPromoByID(
    { promo_id }
  );

  let new_promo_name = manufactured_promo.fields['Name'];
  let new_promo_image = manufactured_promo.fields['Image URL'];
  let new_promo_details = manufactured_promo.fields['Details'];

  let promo_data = {
    ['Promotion Name']: `${new_promo_name} on ${service_name}`,
    ['Type']: `${service_name}-${new_promo_name.trim().toLowerCase()}`,
    ['Active?']: true,
    ['Details']: new_promo_details,
    ['Expiration Date']: expiration_date,
    ['Image URL']: new_promo_image,
    ['Claim Limit']: Number(claim_limit.trim()),
    ['Total Claim Count']: 0,
    ['Total Used']: 0,
  }

  let new_promo = await createPracticePromo(
    { practice_promos_base_id, promo_data }
  );

  return new_promo;
}

// Mapping Functions
let toServicesGallery = (data) => ({ id: service_id, fields: service }) => {
  let { practice_id, practice_promos_base_id } = data;

  let title = service['Name'];
  let image_url = service['Image URL'];

  let btn = createBtn(
    `View Service Promos|show_block|[JSON] Get Manufactured Service Promos`,
    { service_id, practice_id, practice_promos_base_id }
  );

  let buttons = [btn];

  return { title, image_url, buttons };
}

let toPromosGallery = (data) => ({ id: promo_id, fields: promo }) => {
  let { practice_id, practice_promos_base_id, service_id } = data;

  let title = `${promo['Name']} on ${promo['Service Name']}`;
  let image_url = promo['Image URL'];

  let btn1 = createBtn(
    `Create Promo|show_block|[JSON] Create Manufactured Promo`,
    { service_id, promo_id, practice_id, practice_promos_base_id }
  );

  let btn2 = createBtn(
    `View Promo Details|show_block|[JSON] View Manufactured Promo Details`,
    { service_id, promo_id, practice_id, practice_promos_base_id }
  );

  let buttons = [btn1, btn2];

  return { title, image_url, buttons };
}

module.exports = {
  getServicesWithPromos,
  createNewPromo,
  toServicesGallery,
  toPromosGallery,
}