let { BASEURL, PRACTICE_DATABASE_BASE_ID } = process.env;
let { createButtonMessage } = require('../libs/bots');
let { createURL } = require('../libs/helpers');
let { getProviderByUserID } = require('../libs/providers');

let { getTable, getAllDataTable, findTableData } = require('../libs/data');

let getPracticesTable = getTable('Practices');
let practicesTable = getPracticesTable(PRACTICE_DATABASE_BASE_ID);
let findPractice = findTableData(practicesTable);
let getPromosTable = getTable('Promos');

let getUserPromos = async ({ provider_base_id, user_id }) => {
  let promosTable = getPromosTable(provider_base_id);
  let getPromos = getAllDataTable(promosTable);
  let view = 'Active Promos';
  let promos = await getPromos({ view });
  
  let matched_promos = promos.filter(
    promo => promo.fields['Claimed By Users'].includes(user_id)
  );

  return matched_promos;
}

let toGalleryElement = ({ id: promo_id, fields: promo }) => {
  let title = promo['Promotion Name'];
  let subtitle = promo[''];
}

let verifyPromo = async ({ query }, res) => {
  let messenger_user_id = query['messenger user id'];
  let user_id = query['user_id'];

  let provider = await getProviderByUserID(messenger_user_id);
  let provider_base_id = provider.fields['Practice Base ID'];

  let promos = await getUserPromos({ provider_base_id, user_id });

  if (!promos[0]) {
  
  }

  


  let messages = createPromoValidMsg({ promo, provider_base_id, query });
  res.send({ messages });
}

module.exports = verifyPromo;

/*
  if (promo.fields['Total Used'] >= promo.fields['Total Claim Count']) {
    let redirect_to_users = ['[Admin Verify Promo] Used Limit Reached'];
    let promo_claim_limit = promo.fields['Total Claim Count'];
    let set_attributes = { promo_claim_limit };
    res.send({ redirect_to_users });
    return;
  }
*/