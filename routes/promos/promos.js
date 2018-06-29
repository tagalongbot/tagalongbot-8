let { createGallery } = require('../../libs/bots.js');
let { shuffleArray, flattenArray } = require('../../libs/helpers.js');

let { searchPractices, filterPracticesByService } = require('../../libs/data/practices.js');
let { getPracticePromos } = require('../../libs/data/practice/promos.js');
let { getPractices, filterPromosByService, toGalleryElement } = require('../../libs/promos/promos.js');

let getPromos = async ({ query }, res) => {
  let { messenger_user_id, first_name, last_name, gender, service_name } = query;
  let { search_promos_state: state_name, search_promos_city: city_name } = query;

  let practices = await searchPractices({ state_name, city_name });

  let practices_by_service = (service_name) ? filterPracticesByService(service_name, practices) : null;

  // Study transducers to improve code
  let practice_promos = await Promise.all(
    (practices_by_service || practices).map(async (practice) => {
      let practice_id = practice.id;
      let practice_base_id = practice.fields['Practice Base ID'];
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