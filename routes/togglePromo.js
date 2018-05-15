let { BASEURL } = process.env;
let { createURL, localizeDate } = require('../libs/helpers');
let { createGallery, createMultiGallery } = require('../libs/bots');
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

  let promoMsg = `${promo.fields['Promotion Name']} is now ${updatedPromo.fields['Active?'] ? 'Active' : 'Deactivated'}`;

  let messages = [promoMsg];
  res.send({ messages });
}

module.exports = togglePromo;