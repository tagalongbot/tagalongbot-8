let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');

let getServices = require('../routes/services/services.js');
let getServiceDescription = require('../routes/services/description.js');
let getServiceProviderPromos = require('../routes/services/provider/promos.js');
let getServiceProviders = require('../routes/services/providers.js');
let getServicePromos = require('../routes/services/promos.js');

router.get(
  '/search/:service_type', 
  handleRoute(getServices, '[Error] Searching Services')
);

router.get(
  '/description/:show_providers', 
  handleRoute(getServiceDescription, '[Error] Viewing Service Description')
);

router.get(
  '/provider/promos', 
  handleRoute(getServiceProviderPromos, '[Error] Viewing Service Provider Promos')
);

router.use(
  '/providers', 
  getServiceProviders
);

router.use(
  '/promos', 
  getServicePromos
);

module.exports = router;