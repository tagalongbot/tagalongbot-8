let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');
let cache = require('../middlewares/cache.js');

let getServices = require('../routes/services/services.js');
let getServiceDescription = require('../routes/services/description.js');
let getServiceProviderPromos = require('../routes/services/provider/promos.js');
let getServicePromos = require('../routes/services/promos.js');
let getServicePractices = require('../routes/services/practices.js');

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
  '/promos',
  getServicePromos
);

router.use(
  '/providers',
  getServicePractices
);

module.exports = router;