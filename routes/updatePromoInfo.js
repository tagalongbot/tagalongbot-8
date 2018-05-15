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
  
  let

}

let updatePromoInfo = async ({ query }, res) => {
  let update_promo_field_name = query;
  let { promo_id, provider_base_id } = query;
  let messenger_user_id = query['messenger user id'];
  let provider = await getProviderByUserID(messenger_user_id);

  let promosTable = getPromosTable(provider_base_id);
  let findPromo = findTableData(promosTable);
  let updatePromo = updateTableData(promosTable);

  let promo = await findPromo(promo_id);

  let updatePromoData = {
    [update_promo_field_name]: 
  }
  
  let updatedPromo = await updatePromo(updatePromoData, promo);
  
  let promoMsg = createPromoMsg(promo);

  let messages = [promoMsg];
  res.send({ messages });
}

router.get('/', getUpdateField);
router.get('/update', updatePromoInfo);

module.exports = router;