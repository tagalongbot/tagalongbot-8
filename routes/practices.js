let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');
let cache = require('../middlewares/cache.js');

let getPractices = require('../routes/providers/practices.js');
let getProviderServices = require('../routes/providers/services.js');
let getProviderPromos = require('../routes/providers/promos.js');
let claimProvider = require('../routes/providers/claim.js');
let practiceClaimed = require('../routes/providers/claimed.js');
let listProvider = require('../routes/providers/list.js');

router.get(
  '/search/:search_type',
  handleRoute(getPractices, '[Error] Searching Providers')
);

router.get(
  '/services',
  cache.withTtl('1 day'),
  handleRoute(getProviderServices, '[Error] Viewing Provider Services')
);

router.get(
  '/promos',
  handleRoute(getProviderPromos, '[Error] Viewing Provider Promos')
);

router.use(
  '/claim',
  claimProvider,
);

router.get(
  '/claimed',
  handleRoute(practiceClaimed, '[Error] Checking Claimed Provider')
);

router.get(
  '/list',
  handleRoute(listProvider, '[Error] Listing Provider')
);

module.exports = router;