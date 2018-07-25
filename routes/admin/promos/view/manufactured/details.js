let { getManufacturedPromoByID } = require('../../../../../libs/data/manufactured-promos.js');
let { createDetailsMsg } = require('../../../../../libs/admin/promos/view/manufactured/details.js');

let viewManufacturedPromoDetails = async ({ query }, res) => {
  let { service_id, promo_id, practice_id, practice_promos_base_id } = query;

  let promo = await getManufacturedPromoByID(
    { promo_id }
  );

  let msg = createDetailsMsg(
    { service_id, promo_id, promo, practice_id, practice_promos_base_id }
  );

  let messages = [msg];
  res.send({ messages });
}

module.exports = viewManufacturedPromoDetails;