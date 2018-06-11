let { BASEURL } = process.env;
let { createGallery } = require('../libs/bots');
let { shuffleArray, createURL } = require('../libs/helpers');
let { searchPromotionsByLocation, toGalleryElement, toGalleryData } = require('../libs/promos');

let getPromos = async ({ query, params }, res) => {
  let { search_type } = params;

  let first_name = query['first name'] || query['first_name'];
  let last_name = query['last name'] || query['last_name'];
  let gender = query['gender'];
	let messenger_user_id = query['messenger user id'] || query['messenger_user_id'];

  let service_name = query['service_name'];

  let { search_promos_state, search_promos_city, search_promos_zip_code } = query;

	let promotions = await searchPromotionsByLocation(query, { search_type, service_name, active: true });

  let promosGalleryData = promotions.reduce(toGalleryData({ first_name, last_name, gender, messenger_user_id }), []);

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