let { getPracticeByUserID } = require('../../../../libs/data/practices.js');
let { getUserByMessengerID, getUserPromos } = require('../../../../libs/data/users.js');

let { toGalleryElement } = require('../../../../libs/admin/promos/view/user.js');
let { createMultiGallery } = require('../../../../libs/bots.js');

let viewUserPromos = async ({ query }, res) => {
  let { 
    messenger_user_id, // messenger id of the provider
    user_messenger_id, // messenger id of the consumer
  } = query;

  let practice = await getPracticeByUserID(messenger_user_id);
  let practice_promos_base_id = practice.fields['Practice Promos Base ID'];

  let user = await getUserByMessengerID(
    { practice_promos_base_id, user_messenger_id }
  );

  let user_id = user.id;
  let user_name = `${user.fields['First Name']} ${user.fields['Last Name']}`;

  let promos = await getUserPromos(
    { practice_promos_base_id, user_id, view: 'Active Promos' }
  );

  if (!promos[0]) {
    let redirect_to_blocks = ['[Admin Verify Promo] No User Promos Found'];
    let user_name = `${user.fields['First Name']} ${user.fields['Last Name']}`;
    let set_attributes = { user_name };
    res.send({ redirect_to_blocks, set_attributes });
    return;
  }

  let galleryData = promos.map(
    toGalleryElement({ practice_promos_base_id, messenger_user_id, user_messenger_id, user_id })
  );

  let messages = [
    { text: `Here are the promos claimed by ${user_name} from your practice` },
    ...createMultiGallery(galleryData)
  ];

  res.send({ messages });
}

module.exports = viewUserPromos;