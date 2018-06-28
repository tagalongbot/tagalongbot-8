let { getPracticeByUserID } = require('../../../../libs/data/providers.js');
let { getPracticePromos } = require('../../../../libs/data/practice/promos.js');
let { toGalleryData } = require('../../../../libs/admin/promos/view/all.js');
let { createMultiGallery } = require('../../../../libs/bots.js');

let viewAllPromos = async ({ query }, res) => {
  let { messenger_user_id } = query;

  let practice = await getProviderByUserID(messenger_user_id);
  let practice_base_id = practice.fields['Practice Base ID'];

  let promos = await getPracticePromos({ provider_base_id });

  if (!promos[0]) {
    let redirect_to_blocks = ['No Promotions Setup'];
    res.send({ redirect_to_blocks });
    return;
  }

  let galleryData = promos.map(
    toGalleryData({ messenger_user_id, practice_base_id })
  );

  let messages = createMultiGallery(galleryData);
  res.send({ messages });
}

module.exports = viewAllPromos;