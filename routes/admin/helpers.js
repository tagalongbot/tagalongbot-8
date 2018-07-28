let handleRoute = require('../../middlewares/handleRoute.js');

let { localizeDate } = require('../../libs/helpers.js');
let { createExpirationDate } = require('../../libs/admin/promos/create.js');

let express = require('express');
let router = express.Router();

let updateExpirationDate = async ({ query }, res) => {
  let { new_promo_expiration_date } = query;

  let expiration_date = localizeDate(
    createExpirationDate(new_promo_expiration_date)
  );

  let set_attributes = {
    new_promo_expiration_date: expiration_date
  }

  res.send({ set_attributes });
}

router.get(
  '/update/date',
  handleRoute(updateExpirationDate, '[Error] Admin')
);

module.exports = router;