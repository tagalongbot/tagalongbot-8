let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');
let cache = require('../middlewares/cache.js');

let getServices = require('../routes/services/services.js');
let getServiceDescription = require('../routes/services/description.js');
let getServicePracticePromos = require('../routes/services/practice/promos.js');
let getServicePromos = require('../routes/services/promos.js');
let getServicePractices = require('../routes/services/practices.js');

router.get(
  '/search/:service_type',
  handleRoute(getServices, '[Error] Searching Services')
);

router.get(
  '/description/:show_practices',
  handleRoute(getServiceDescription, '[Error] Viewing Service Description')
);

router.get(
  '/practice/promos',
  handleRoute(getServicePracticePromos, '[Error] Viewing Service Practice Promos')
);

router.use(
  '/promos',
  getServicePromos
);

router.use(
  '/practices',
  getServicePractices
);

module.exports = router;