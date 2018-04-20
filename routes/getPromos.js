let { BASEURL, PRACTICE_DATABASE_BASE_ID, USERS_BASE_ID, SERVICES_BASE_ID } = process.env;
let { createGallery } = require('../libs/bots');
let { shuffleArray } = require('../libs/helpers');

let { searchProviders } = require('../libs/providers');
let { getTable, getAllDataFromTable, createTableData, updateTableData } = require('../libs/data');

// Get Tables
let getUsersTable = getTable('Users');
let getPromosTable = getTable('Promos');

// Tables
let usersTable = getUsersTable(USERS_BASE_ID);

// Get Data
let getUsers = getAllDataFromTable(usersTable);

// Search Methods
let searchPromotions = async (data, search_type) => {
	let { search_promos_state, search_promos_city, search_promos_zip_code, search_promo_code } = data;

  let providers = await searchProviders({
    search_providers_state: search_promos_state, 
    search_providers_city: search_promos_city, 
    search_providers_zip_code: search_promos_zip_code,
  });
  
  let providersBaseIDs = providers.map((provider) => provider.fields['Practice Base ID']);

  let filterByFormula = `AND({Active?}, NOT({Claim Limit Reached}))`;

  let allPromos = [];
  for (let baseID of providersBaseIDs) {
    let promosTable = getPromosTable(baseID);
    let getPromos = getAllDataFromTable(promosTable);
    let promos = await getPromos({ filterByFormula });
    console.log(promos);
    
    allPromos = allPromos.concat(promos);
  }
  
  console.log(allPromos);
  return allPromos;
}

let toGalleryElement = ({ id: provider_id, fields: provider }) => {
  let title = provider['Practice Name'].slice(0, 80);
  let subtitle = `${provider['Main Provider']} | ${provider['Practice Address']}`;
  let image_url = provider['Main Provider Image'][0].url;

  let btn1 = {
    title: 'View Services',
    type: 'json_plugin_url',
    url: `${BASEURL}/provider/services?provider_id=${provider_id}&provider_name=${encodeURIComponent(provider['Practice Name'])}`
  }

  let btn2 = {
    title: 'View Promos',
    type: 'json_plugin_url',
    url: `${BASEURL}/provider/promos?provider_id=${provider_id}&provider_name=${encodeURIComponent(provider['Practice Name'])}`
  }

  let buttons = [btn1, btn2];

  let element = { title, subtitle, image_url, buttons};
  return element;
}

let getPromos = async ({ query, params }, res) => {
  let { search_type } = params;

  let first_name = query['first name'];
	let messenger_user_id = query['messenger user id'];

	let promotions = await searchPromotions(query, search_type);

  if (!promotions[0]) {
    let redirect_to_blocks = ['No Promos Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let textMsg = { text: `Here's are some promotions I found ${first_name}` };
  let randomPromotions = shuffleArray(promotions).slice(0, 10).map(toGalleryElement);
	let promotionsGallery = createGallery(randomPromotions);

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