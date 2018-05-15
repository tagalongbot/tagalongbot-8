let { BASEURL } = process.env;
let { createURL, localizeDate } = require('../libs/helpers');
let { createGallery, createMultiGallery } = require('../libs/bots');
let { getProviderByUserID } = require('../libs/providers');

let { getTable, getAllDataFromTable, findTableData, updateTableData } = require('../libs/data');

let getPromosTable = getTable('Promos');

let express = require('express');
let router = express.Router();

let getUpdateField = ({ query }, res) => {
  let { promo_id, provider_base_id } = query;

  let set_attributes = {
    updating_promo_id: promo_id,
    updating_provider_base_id: provider_base_id
  }

  let redirect_to_blocks = ['Update Promo'];
  res.send({ set_attributes, redirect_to_blocks });
}

let updatePromoInfo = async ({ query }, res) => {
  let { update_promo_field_name, update_promo_field_value } = query;
  let { updating_promo_id, updating_provider_base_id } = query;
  let messenger_user_id = query['messenger user id'];
  let provider = await getProviderByUserID(messenger_user_id);

  let promosTable = getPromosTable(updating_provider_base_id);
  let findPromo = findTableData(promosTable);
  let updatePromo = updateTableData(promosTable);

  let promo = await findPromo(updating_promo_id);

  let updatePromoData = {
    [update_promo_field_name]: update_promo_field_value
  }

  let updatedPromo = await updatePromo(updatePromoData, promo);

  let txtMsg = ``;

  let messages = [{ text: txtMsg }];
  res.send({ messages });
}

router.get('/', getUpdateField);
router.get('/field', updatePromoInfo);

module.exports = router;