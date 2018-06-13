let { BASEURL } = process.env;
let { createGallery } = require('../../libs/bots.js');
let { shuffleArray, flattenArray } = require('../../libs/helpers.js');
let { searchProviders, filterProvidersByService } = require('../../libs/providers.js');
let { searchPromotionsByLocation, toGalleryElement, toGalleryData } = require('../../libs/promos.js');

let getProviders = async ({ search_promos_state, search_promos_city, search_promos_zip_code, search_type }) => {
  let search_providers_state = search_promos_state;
  let search_providers_city = search_promos_city;
  let search_providers_zip_code = search_promos_zip_code;

  let providers = await searchProviders(
    { search_type, active: true },
    { search_providers_state, search_providers_city, search_providers_zip_code, }
  );

  return providers;
}

let getPromos = async ({ query, params }, res) => {
  let { search_type } = params;

  let { messenger_user_id, first_name, last_name, gender } = query;
  let { service_name, search_promos_state, search_promos_city, search_promos_zip_code, search_promo_code } = query;

  let providers = await getProviders({ search_promos_state, search_promos_city, search_promos_zip_code, search_type });

  if (service_name) providers = filterProvidersByService(service_name, providers);

  let providersBaseIDs = providers.map((provider) => provider.fields['Practice Base ID']);

  
  
  
  
  

	let promotions = await searchPromotionsByLocation(
    { search_promos_state, search_promos_city, search_promos_zip_code, search_promo_code, search_type, service_name }
  );

  let promosGalleryData = promotions.map(
    toGalleryData({ first_name, last_name, gender, messenger_user_id })
  );

  if (!promosGalleryData[0]) {
    let redirect_to_blocks = ['No Promos Found'];
    res.send({ redirect_to_blocks });
    return;
  }

	let randomPromotions = shuffleArray(promosGalleryData).slice(0, 10);
	let promotionsGallery = createGallery(randomPromotions);

  let textMsg = { text: `Here's are some promotions I found ${first_name}` };
	let messages = [textMsg, promotionsGallery];
	res.send({ messages });
}

let handleErrors = (req, res) => (error) => {
  console.log(error);
	let source = 'airtable';
	res.send({ source, error });
}

module.exports = (req, res) => {
	getPromos(req, res)

	.catch(
		handleErrors(req, res)
	);
}