let { flattenArray } = require('../../../libs/helpers.js');
let { createMultiGallery } = require('../../../libs/bots.js');

let { getUserByMessengerID } = require('../../../libs/users.js');
let { getUserPromos } = require('../../../libs/claimed.js');

let viewClaimedPromos = async ({ query }, res) => {
  let { messenger_user_id, first_name, last_name, gender } = query;

  // Need to check if gender problem still exists
  let data = { first_name, last_name, gender1: gender, messenger_user_id };

  let user = await getUserByMessengerID(messenger_user_id);

  let practice_ids = (user.fields['Practices Claimed Promos From'] || '').split(',').filter(Boolean);

  let promos = practice_ids.map(
    getUserPromos({ messenger_user_id, data })
  );

  let galleryData = flattenArray(
    await Promise.all(promos)
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