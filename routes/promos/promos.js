let { createGallery } = require('../../libs/bots.js');
let { shuffleArray, flattenArray } = require('../../libs/helpers.js');

let { filterPracticesByService } = require('../../libs/data/practices.js');
let { getPracticePromos } = require('../../libs/data/practice/promos.js');
let { getPractices, filterPromosByService, toGalleryElement } = require('../../libs/promos/promos.js');

let getPromos = async ({ query, params }, res) => {
  let { search_type } = params;

  let { messenger_user_id, first_name, last_name, gender } = query;
  let { service_name, search_promos_state, search_promos_city, search_promos_zip_code, search_promo_code } = query;

  // Handle searching by `promo_code`
  let practices = await getPractices(
    { search_promos_state, search_promos_city, search_promos_zip_code, search_type }
  );

  let practices_by_service = (service_name) ? filterPracticesByService(service_name, practices) : null;

  // Study transducers to improve code
  let practice_promos = await Promise.all(
    (practices_by_service || practices).map(async (provider) => {
      let practice_id = provider.id;
      let practice_base_id = provider.fields['Practice Base ID'];
      let view = 'Active Promos';
      let promos = await getPracticePromos({ practice_base_id, view });

      let matching_promos = (service_name) ? filterPromosByService({ service_name, promos }) : promos;

      return matching_promos.map(
        toGalleryElement({ messenger_user_id, practice_id, practice_base_id, first_name, last_name, gender })
      );
    })
  );

  let randomPromotions = shuffleArray(
    flattenArray(practice_promos)
  ).slice(0, 10);

  if (!randomPromotions[0]) {
    let redirect_to_blocks = ['No Promos Found'];
    res.send({ redirect_to_blocks });
    return;
  }

	let promotionsGallery = createGallery(randomPromotions);

  let txtMsg = { text: `Here's are some promotions I found ${first_name}` };
	let messages = [txtMsg, promotionsGallery];
	res.send({ messages });
}

module.exports = getPromos;