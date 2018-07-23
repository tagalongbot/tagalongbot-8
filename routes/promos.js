let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');
let cache = require('../middlewares/cache.js');

let getPromos = require('../routes/promos/promos.js');
let getPromoDetails = require('../routes/promos/details.js');
let getPromoPractice = require('../routes/promos/practice.js');
let claimPromotion = require('../routes/promos/claim.js');
let viewClaimedPromos = require('../routes/promos/view/claimed.js');

// Broadcasts
let findPromosOffLastSearch = require('../routes/promos/broadcasts.js');

router.get(
  '/search/:search_type',
  cache.withTtl('15 minutes'),
  handleRoute(getPromos, '[Error] User')
);

router.get(
  '/search/last',
  handleRoute(findPromosOffLastSearch, '[Error] User')
);

router.get(
  '/details/:is_claimed',
  handleRoute(getPromoDetails, '[Error] User')
);

router.get(
  '/practice',
  cache.withTtl('1 day'),
  handleRoute(getPromoPractice, '[Error] User')
);

router.use(
  '/claim',
  claimPromotion
);

router.get(
  '/view/claimed',
  handleRoute(viewClaimedPromos, '[Error] User')
);

module.exports = router;