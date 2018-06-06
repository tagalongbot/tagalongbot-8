let { BASEURL, PRACTICE_DATABASE_BASE_ID } = process.env;
let { createButtonMessage } = require('../libs/bots');
let { createURL } = require('../libs/helpers');
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

let createPromoValidMsg = ({ promo, query }) => {
  let first_name = query['first name'];
  let promo_id = promo.id;
  let update_promo_url = createURL(`${BASEURL}/promo/verify/update`, { promo_id });

  let msg = createButtonMessage(
    `${first_name} this is a valid promo, would you like to update this promo as used`,
    `Update Promo As Used|json_plugin_url|${update_promo_url}`,
    `Admin Menu|show_block|Get Admin Menu`
  );

  return [msg];
}

let createPromoInvalidMsg = ({ query }) => {
  let first_name = query['first name'];

  let msg = createButtonMessage(
    `Sorry ${first_name} this promo does not exist (Invalid Promo Code)`,
    `Try Again|show_block|Verify Promotion`,
    `Admin Menu|show_block|Get Admin Menu`
  );
  
  return [msg];
}

let verifyPromo = async ({ query }, res) => {
  let messenger_user_id = query['messenger user id'];
  let promo_id = query['promo_id'];

  let provider = await getProviderByUserID(messenger_user_id);
  let provider_base_id = provider.fields['Practice Base ID'];

  let promo = await getPromo({ provider_base_id, promo_id });

  let messages = (promo) ? createPromoValidMsg({ promo, query }) : createPromoInvalidMsg({ query });
  res.send({ messages });
}

module.exports = verifyPromo;