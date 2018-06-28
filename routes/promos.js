let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');
let cache = require('../middlewares/cache.js');

let getPromos = require('../routes/promos/promos.js');
let getPromoDetails = require('../routes/promos/details.js');
let getPromoPractice = require('../routes/promos/practice.js');
let claimPromotion = require('../routes/promos/claim.js');
let viewClaimedPromos = require('../routes/promos/view/claimed.js');

router.get(
  '/search/:search_type',
  cache.withTtl('15 minutes'),
  handleRoute(getPromos, '[Error] Searching Promos')
);

router.get(
  '/details/:is_claimed',
  handleRoute(getPromoDetails, '[Error] Viewing Promo Details')
);

router.get(
  '/practice',
  cache.withTtl('1 day'),
  handleRoute(getPromoPractice, '[Error] Viewing Promo Practice')
);

router.use(
  '/claim',
  claimPromotion
);

router.get(
  '/view/claimed',
  handleRoute(viewClaimedPromos, '[Error] Viewing Claimed Promos')
);

module.exports = router;