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

router.get(
  '/promos/:zip_code', 
  handleRoute(getServicePromos, '[Error] User')
);

router.get(
  '/practices/:zip_code',
  handleRoute(getServicePractices, '[Error] User')
);

module.exports = router;