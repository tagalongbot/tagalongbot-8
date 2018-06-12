let { getPromo, updatePromo, createUpdateMsg } = require('../../../libs/admin/promos/update.js');

let express = require('express');
let router = express.Router();

let getUpdateField = ({ query }, res) => {
  let { promo_id, provider_base_id } = query;

  let updating_promo_id = promo_id;
  let updating_provider_base_id = provider_base_id;

  let set_attributes = { updating_promo_id, updating_provider_base_id };
  let redirect_to_blocks = ['Update Promo'];
  res.send({ set_attributes, redirect_to_blocks });
}

let updatePromoInfo = async ({ query }, res) => {
  let { 
    updating_promo_id,
    updating_provider_base_id,
    update_promo_field_name, 
    update_promo_field_value 
  } = query;

  let messenger_user_id = query['messenger user id'];

  let promo_id = updating_promo_id;
  let provider_base_id = updating_provider_base_id;

  let promo = await getPromo({ provider_base_id, promo_id });
  let updatedPromo = await updatePromo({ provider_base_id, promo, update_promo_field_name, update_promo_field_value });

  let updateMsg = createUpdateMsg({ promo_id, provider_base_id, promo, updatedPromo, update_promo_field_name, update_promo_field_value });
  
  let messages = [updateMsg];
  res.send({ messages });
}

router.get('/', getUpdateField);
router.get('/field', updatePromoInfo);

module.exports = router;