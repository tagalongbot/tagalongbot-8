let handleRoute = require('../../middlewares/handleRoute.js');

let { localizeDate } = require('../../libs/helpers.js');

let express = require('express');
let router = express.Router();

let updateExpirationDate = async ({ query }, res) => {
  let { } = query;

  let set_attributes = {
    new_promo_expiration_date: ''
  }

  res.send({ set_attributes });
}

router.get(
  '/update/date',
  handleRoute(updateExpirationDate, '[Error] Admin')
);

module.exports = router;