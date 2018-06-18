let { flattenArray } = require('../../../libs/helpers.js');
let { createMultiGallery } = require('../../../libs/bots.js');

let { getUserByMessengerID } = require('../../../libs/data/users.js');
let { getUserClaimedPromos, toGalleryElement } = require('../../../libs/promos/view/claimed.js');

let viewClaimedPromos = async ({ query }, res) => {
  // Need to check if gender problem still exists
  let { messenger_user_id, first_name, last_name, gender } = query;

  let user = await getUserByMessengerID(messenger_user_id);
  let user_id = user.id;
  
  let practice_ids = (user.fields['Practices Claimed Promos From'] || '').split(',').filter(Boolean);

  let practice_promos = practice_ids.map(
    getUserClaimedPromos({ messenger_user_id, user_id })
  );

  let promos = flattenArray(
    await Promise.all(promos)
  );

  let galleryData = promos.map(
    toGalleryElement({ messenger_user_id, first_name, last_name, gender1: gender })
  );

  if (!galleryData[0]) {
    let redirect_to_blocks = ['[User] No Claimed Promos'];
    res.send({ redirect_to_blocks });
    return;
  }

  let messages = createMultiGallery(galleryData);
  res.send({ messages });
}

module.exports = viewClaimedPromos;