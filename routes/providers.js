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
  handleRoute(getProviders, '[Search Providers] Error')
);

router.get(
  '/services', 
  handleRoute(getProviderServices, '[Provider Services] Error')
);

router.get(
  '/promos', 
  handleRoute(getProviderPromos, '[Provider Promos] Error')
);

router.get(
  '/claim', 
  handleRoute(claimProvider, '[Claim Provider Promo] Error')
);

router.get(
  '/claimed', 
  handleRoute(providerClaimed, '[Provider Promo Claimed] Error')
);

router.get(
  '/list', handleRoute(listProvider, '[List Provider] Error')
);

module.exports = router;