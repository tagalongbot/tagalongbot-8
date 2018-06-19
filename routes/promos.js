let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');

let getPromos = require('../routes/promos/promos.js');
let getPromoDetails = require('../routes/promos/details.js');
let getPromoProvider = require('../routes/promos/provider.js');
let claimPromotion = require('../routes/promos/claim.js');
let viewClaimedPromos = require('../routes/promos/view/claimed.js');

router.get(
  '/search/:search_type', 
  getPromos
);

router.get(
  '/details', 
  getPromoDetails
);

router.get(
  '/provider', 
  getPromoProvider
);

router.use(
  '/claim', 
  claimPromotion
);

router.get(
  '/view/claimed', 
  viewClaimedPromos
);

module.exports = router;