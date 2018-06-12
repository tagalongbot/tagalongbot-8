let { BASEURL } = process.env;
let { createURL, localizeDate } = require('../libs/helpers');
let { createButtonMessage } = require('../libs/bots');
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

  let text = `Updated ${update_promo_field_name} to "${update_promo_field_value}" for ${promo.fields['Promotion Name']} `;

  let promo_id = updating_promo_id;
  let provider_base_id = updating_provider_base_id;

  let view_promo_details_url = createURL(`${BASEURL}/promo/view/info`, { promo_id, provider_base_id });
  let update_promo_url = createURL(`${BASEURL}/promo/update`, { promo_id, provider_base_id });
  let toggle_promo_url = createURL(`${BASEURL}/promo/toggle`, { promo_id, provider_base_id });

  let msg = createButtonMessage(
    text,
    `View Promo Details|json_plugin_url|${view_promo_details_url}`,
    `Update Promo|json_plugin_url|${update_promo_url}`,
    `${updatedPromo.fields['Active?'] ? 'Deactivate' : 'Activate'}|json_plugin_url|${toggle_promo_url}`,
  );

  let messages = [msg];
  res.send({ messages });
}

router.get('/', getUpdateField);
router.get('/field', updatePromoInfo);

module.exports = router;