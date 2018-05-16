let { BASEURL } = process.env;
let { createURL } = require('../libs/helpers');
let { createButtonMessage } = require('../libs/bots');
let { getProviderByUserID } = require('../libs/providers');

let { getTable, findTableData, updateTableData } = require('../libs/data');

let getPromosTable = getTable('Promos');

let togglePromo = async ({ query }, res) => {
  let { promo_id, provider_base_id } = query;
  let messenger_user_id = query['messenger user id'];
  let provider = await getProviderByUserID(messenger_user_id);

  let promosTable = getPromosTable(provider_base_id);
  let findPromo = findTableData(promosTable);
  let updatePromo = updateTableData(promosTable);

  let promo = await findPromo(promo_id);

  let updatePromoData = {
    ['Active?']: promo.fields['Active?'] ? false : true
  }

  let updatedPromo = await updatePromo(updatePromoData, promo);
  
  let view_promo_details_url = createURL(`${BASEURL}/promo/view/info`, { promo_id, provider_base_id });
  let update_promo_url = createURL(`${BASEURL}/promo/update`, { promo_id, provider_base_id });
  let toggle_promo_url = createURL(`${BASEURL}/promo/toggle`, { promo_id, provider_base_id });

  let txtMsg = createButtonMessage(
    `${promo.fields['Promotion Name']} is now ${updatedPromo.fields['Active?'] ? 'Active' : 'Deactivated'}`,
    `${updatedPromo.fields['Active?'] ? 'Deactivate' : 'Activate'}|json_plugin_url|${toggle_promo_url}`,
    `View Promo Details|json_plugin_url|${view_promo_details_url}`,
    `Update Promo|json_plugin_url|${update_promo_url}`,
  );

  let messages = [txtMsg];
  res.send({ messages });
}

module.exports = togglePromo;