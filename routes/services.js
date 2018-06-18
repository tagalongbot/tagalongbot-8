let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');

let getServices = require('../routes/services/services.js');
let getServiceDescription = require('../routes/services/description.js');
let getServiceProviderPromos = require('../routes/services/provider/promos.js');
let getServiceProviders = require('../routes/services/providers.js');
let getServicePromos = require('../routes/services/promos.js');

router.get(
  '/search/:service_type', getServices
);

router.get(
  '/description/:show_providers', getServiceDescription
);

router.get(
  '/provider/promos', getServiceProviderPromos
);

router.use(
  '/providers', getServiceProviders
);

router.get(
  '/promos', getServicePromos
);

module.exports = router;