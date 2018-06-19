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
  handleRoute(getPromos, '[Error] Searching Promos')
);

router.get(
  '/details',
  handleRoute(getPromoDetails, '[Error] Viewing Promo Details')
);

router.get(
  '/provider',
  handleRoute(getPromoProvider, '[Error] Viewing Promo Provider')
);

router.use(
  '/claim',
  handleRoute(claimPromotion, '[Error] Claiming Promo')
);

router.get(
  '/view/claimed',
  handleRoute(viewClaimedPromos, '[Error] Viewing Claimed Promos')
);

module.exports = router;