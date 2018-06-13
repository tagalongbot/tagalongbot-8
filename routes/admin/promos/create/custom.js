let { getProviderByUserID } = require('../../../../libs/providers.js');
let { createNewPromo } = require('../../../../libs/admin/promos/create/custom.js');

let createCustomPromo = async ({ query }, res) => {
  let { 
    messenger_user_id,
    new_promo_name,
    new_promo_image,
    new_promo_expiration_date,
    new_promo_claim_limit
  } = query;

  let provider = await getProviderByUserID(messenger_user_id);
  let provider_base_id = provider.fields['Practice Base ID'];

  let new_promo = await createNewPromo(
    { provider_base_id, new_promo_name, new_promo_image, new_promo_expiration_date, new_promo_claim_limit }    
  );

  let redirect_to_blocks = ['New Custom Promo Created'];
  res.send({ redirect_to_blocks });
}

module.exports = createCustomPromo;