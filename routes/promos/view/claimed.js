let { flattenArray } = require('../../../libs/helpers.js');
let { createMultiGallery } = require('../../../libs/bots.js');

let { getUserByMessengerID, getUserPromos } = require('../../../libs/data/users.js');
let { getUserClaimedPromos, toGalleryElement } = require('../../../libs/promos/view/claimed.js');

let viewClaimedPromos = async ({ query }, res) => {
  let { messenger_user_id, first_name, last_name, gender } = query;

  let user = await getUserByMessengerID(messenger_user_id);
  let user_id = user.id;

  let user_promos = await getUserPromos(
    { user_id, view: 'Active Promos' }
  );

  let promos = flattenArray(
    await Promise.all(practice_promos)
  );

  if (!promos[0]) {
    let redirect_to_blocks = ['No Claimed Promos'];
    res.send({ redirect_to_blocks });
    return;
  }

  let messages = createMultiGallery(promos);
  res.send({ messages });
}

module.exports = viewClaimedPromos;