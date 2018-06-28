let { getPracticeByID } = require('../../libs/data/practices.js');
let { getPracticePromo } = require('../../libs/data/practice/promos.js');

let { toGalleryElement } = require('../../libs/practices/practices.js');
let { createGallery } = require('../../libs/bots.js');

let getPromoPractice = async ({ query }, res) => {
  let { practice_id, practice_base_id, promo_id, first_name, last_name, gender, messenger_user_id } = query;

  let promo = await getPracticePromo({ practice_base_id, promo_id });

  if (!promo) {
    let redirect_to_blocks = ['Promo No Longer Active'];
    res.send({ redirect_to_blocks });
    return;
  }

  let practice = await getPracticeByID(practice_id);

  if (!practice) {
    let redirect_to_blocks = ['No Practices Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let practices_gallery_data = [practice].map(
    toGalleryElement({ first_name, last_name, gender, messenger_user_id })
  );

  let practices_gallery = createGallery(practices_gallery_data, 'square');
  let messages = [practices_gallery];
  res.send({ messages });
}

module.exports = getPromoPractice;