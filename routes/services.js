let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');

let getServices = require('../routes/services/services.js');
let getServiceDescription = require('../routes/services/description.js');
let getServicePracticePromos = require('../routes/services/practice/promos.js');
let getServicePromos = require('../routes/services/promos.js');
let getServicePractices = require('../routes/services/practices.js');

router.get(
  '/search/:service_type',
  handleRoute(getServices, '[Error] User')
);

router.get(
  '/description/:show_practices',
  handleRoute(getServiceDescription, '[Error] User')
);

router.get(
  '/practice/promos',
  handleRoute(getServicePracticePromos, '[Error] User')
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