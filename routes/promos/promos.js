let { createGallery } = require('../../libs/bots.js');
let { shuffleArray, flattenArray } = require('../../libs/helpers.js');

let { searchPractices } = require('../../libs/data/practices.js');
let { getPracticePromos } = require('../../libs/data/practice/promos.js');

let { toGalleryElement } = require('../../libs/promos/promos.js');

let getPromos = async ({ query }, res) => {
  let { messenger_user_id, first_name, last_name, gender } = query;

  let { search_promos_zip_code: zip_code } = query;

  let practices = await searchPractices(
    { zip_code }
  );

  // Study transducers to improve code
  let practice_promos = await Promise.all(
    practices.map(async (practice) => {
      let practice_id = practice.id;
      let practice_promos_base_id = practice.fields['Practice Promos Base ID'];
      let view = 'Active Promos';
      let promos = await getPracticePromos({ practice_promos_base_id, view });

      return promos.map(
        toGalleryElement({ messenger_user_id, practice_id, practice_promos_base_id, first_name, last_name, gender })
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