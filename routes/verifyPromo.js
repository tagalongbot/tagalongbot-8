let { PRACTICE_DATABASE_BASE_ID } = process.env;
let { getProviderByUserID } = require('../libs/provider');

let { getTable, findTableData } = require('../libs/data');

let getPracticesTable = getTable('Practices');
let practicesTable = getPracticesTable(PRACTICE_DATABASE_BASE_ID);
let findPractice = findTableData(practicesTable);
let getPromosTable = getTable('Promos');

let getPromo = async ({ provider_base_id, promo_id }) => {
  let promosTable = getPromosTable(provider_base_id);
  let findPromo = findTableData(promosTable);
  let promo = await findPromo(promo_id);
  return promo;
}

let createPromoValidMsg = () => {
  
}

let createPromoInvalidMsg = () => {

}

let verifyPromo = async ({ query }, res) => {
  let messenger_user_id = query['messenger user id'];
  let promo_id = query['promo_id'];

  let provider = await getProviderByUserID(messenger_user_id);
  let provider_base_id = provider.fields['Practice Base ID'];
  
  let promo = await getPromo({ provider_base_id, promo_id });

  let messages = (promo) ? createPromoValidMsg(promo) : createPromoInvalidMsg();
  res.send({ messages });
}

module.exports = verifyPromo;