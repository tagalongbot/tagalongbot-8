let { flattenArray } = require('../libs/helpers');
let { createMultiGallery } = require('../libs/bots');

let { getUserByMessengerID } = require('../libs/users');

let viewClaimedPromos = async ({ query }, res) => {
  let messenger_user_id = query['messenger user id'] || query['messenger_user_id'];
  let first_name = query['first name'] || query['first_name'];
  let last_name = query['last name'] || query['last_name'];
  let gender = query['gender'] || query['gender'];

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