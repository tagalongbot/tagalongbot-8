let { convertLongTextToArray, flattenArray } = require('../../../libs/helpers.js');
let { createMultiGallery } = require('../../../libs/bots.js');

let { getUserByMessengerID, getUserPromos } = require('../../../libs/data/users.js');
let { toGalleryElement } = require('../../../libs/promos/view/claimed.js');

let viewClaimedPromos = async ({ query }, res) => {
  let { messenger_user_id, first_name, last_name, gender } = query;

  let user = await getUserByMessengerID(messenger_user_id);
  let user_id = user.id;

  let user_claimed_promos_data = convertLongTextToArray(
    user.fields['Claimed Promos']
  );
  
  let user_promos = await getUserPromos(
    { user_id, view: 'Active Promos' }
  );

  if (!user_promos[0]) {
    let redirect_to_blocks = ['No Claimed Promos'];
    res.send({ redirect_to_blocks });
    return;
  }

  let promos_gallery_data = user_promos.map(
    toGalleryElement({ messenger_user_id, first_name, last_name, gender, user_claimed_promos_data })
  );

  let messages = createMultiGallery(promos_gallery_data);
  res.send({ messages });
}

module.exports = viewClaimedPromos;