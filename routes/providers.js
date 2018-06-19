let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');

let getProviders = require('../routes/providers/providers.js');
let getProviderServices = require('../routes/providers/services.js');
let getProviderPromos = require('../routes/providers/promos.js');
let claimProvider = require('../routes/providers/claim.js');
let providerClaimed = require('../routes/providers/claimed.js');
let listProvider = require('../routes/providers/list.js');

router.get(
  '/search/:search_type',
  handleRoute(getProviders, '[Error] Searching Providers')
);

router.get(
  '/services', 
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
  handleRoute(providerClaimed, '[Error] Viewing Claimed Providers')
);

router.get(
  '/list',
  handleRoute(listProvider, '[Error] Listing Provider')
);

module.exports = router;