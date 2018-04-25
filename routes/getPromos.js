let { BASEURL } = process.env;
let { createGallery } = require('../libs/bots');
let { shuffleArray, createURL } = require('../libs/helpers');

let { searchProviders } = require('../libs/providers');
let { getTable, getAllDataFromTable } = require('../libs/data');

// Get Tables
let getPromosTable = getTable('Promos');

// Search Methods
let searchPromotions = async (data, search_type) => {
	let { search_promos_state, search_promos_city, search_promos_zip_code, search_promo_code } = data;

  let providers = await searchProviders({
    search_providers_state: search_promos_state, 
    search_providers_city: search_promos_city, 
    search_providers_zip_code: search_promos_zip_code,
  }, search_type);

  let providersBaseIDs = providers.map((provider) => provider.fields['Practice Base ID']);
  let filterByFormula = `AND({Active?}, NOT({Claim Limit Reached}))`;

  let promotions = [];
  for (let [index, baseID] of providersBaseIDs.entries()) {
    let promosTable = getPromosTable(baseID);
    let getPromos = getAllDataFromTable(promosTable);
    let promos = await getPromos({ filterByFormula });

    let provider_id = providers[index].id;
    let provider_base_id = providersBaseIDs[index];
    promotions = promotions.concat({ provider_id, provider_base_id, promos });
  }

  // Need for searching with By Expiration Date
  // console.log('All Promos', promotions);
  return promotions;
}

let toGalleryElement = ({ provider_id, provider_base_id, first_name, last_name, gender, messenger_user_id }) => ({ id: promo_id, fields: promo }, index) => {
  let title = promo['Promotion Name'].slice(0, 80);
  let subtitle = promo['Terms'];
  let image_url = promo['Image'][0].url;

  let promo_type = encodeURIComponent(promo['Type']);

  // Bug with Sending "gender" to json_plugin_url button
  let data = { provider_id, provider_base_id, promo_id, first_name, last_name, gender1: gender, messenger_user_id };
  let btn1URL = createURL(`${BASEURL}/promo/details`, data);

  let btn1 = {
    title: 'View Promo Details',
    type: 'json_plugin_url',
    url: btn1URL,
  }

  let buttons = [btn1];

  let element = { title, subtitle, image_url, buttons};
  return element;
}

let getPromos = async ({ query, params }, res) => {
  let { search_type } = params;

  let first_name = query['first name'];
  let last_name = query['last name'];
  let gender = query['gender'];
	let messenger_user_id = query['messenger user id'];

	let promotions = await searchPromotions(query, search_type);
  
  let promosGalleryData = promotions.reduce((arr, { provider_id, provider_base_id, promos }) => {
    return arr.concat(...promos.map(toGalleryElement({ provider_id, provider_base_id, first_name, last_name, gender, messenger_user_id })));
  }, []);

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