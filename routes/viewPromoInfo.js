let { BASEURL } = process.env;
let { createURL, localizeDate } = require('../libs/helpers');
let { createGallery, createMultiGallery } = require('../libs/bots');
let { getProviderByUserID } = require('../libs/providers');

let { getTable, getAllDataFromTable, findTableData, createTableData, updateTableData } = require('../libs/data');

let getPromosTable = getTable('Promos');

let createPromoMsg = ({ fields: promo }) => {
  let te = `
  Promotion Name: ${promo['Promotion Name']}
  Type: ${promo['Type']}
  Active: ${promo['Active?']}
  Terms: ${promo['Terms']}
  Expiration Date: ${promo['Expiration Date']}
  Claim Limit: ${promo['Claim Limit']}
  Total Claim Limit: ${promo['Total Claim Limit']}
  Claim Limit Reached: ${(promo['Claim Limit Reached']) === 1 ? 'TRUE' : 'FALSE'}
`;
  
  return msg;
}

let viewPromoInfo = async ({ query }, res) => {
  let { promo_id, provider_base_id } = query;
  let messenger_user_id = query['messenger user id'];
  let provider = await getProviderByUserID(messenger_user_id);

  let promosTable = getPromosTable(provider_base_id);
  let findPromo = findTableData(promosTable);

  let promo = await findPromo(promo_id);

  let promoMsg = createPromoMsg(promo);

  let messages = [promoMsg];
  res.send({ messages });
}

module.exports = viewPromoInfo;