let { createMultiGallery } = require('../../../../libs/bots.js');
let { getProviderByUserID } = require('../../../../libs/providers.js');

let { getUser, getUserPromos, toGalleryElement } = require('../../../../libs/admin/promos/view/user.js');

let viewUserPromos = async ({ query }, res) => {
  let messenger_user_id = query['messenger user id']; // messenger id of the provider
  let user_messenger_id = query['user_messenger_id']; // messenger id of the consumer

  let provider = await getProviderByUserID(messenger_user_id);
  let provider_base_id = provider.fields['Practice Base ID'];

  let user = await getUser({ provider_base_id, user_messenger_id });
  let user_id = user.id;

  let promos = await getUserPromos({ provider_base_id, user_id });

  if (!promos[0]) {
    let redirect_to_blocks = ['[Admin Verify Promo] No User Promos Found'];
    let user_name = user.fields['First Name'];
    let set_attributes = { user_name };
    res.send({ redirect_to_blocks, set_attributes });
    return;
  }

  let galleryData = promos.map(
    toGalleryElement({ provider_base_id, messenger_user_id, user_messenger_id })
  );

  let messages = createMultiGallery(galleryData);
  res.send({ messages });
}

module.exports = viewUserPromos;

/*
  if (promo.fields['Total Used'] >= promo.fields['Total Claim Count']) {
    let redirect_to_users = ['[Admin Verify Promo] Used Limit Reached'];
    let promo_claim_limit = promo.fields['Total Claim Count'];
    let set_attributes = { promo_claim_limit };
    res.send({ redirect_to_users });
    return;
  }
*/