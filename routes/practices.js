let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');
let cache = require('../middlewares/cache.js');

let getPractices = require('../routes/practices/practices.js');
let getPracticeServices = require('../routes/practices/services.js');
let getPracticePromos = require('../routes/practices/promos.js');
let claimPractice = require('../routes/practices/claim.js');
let practiceClaimed = require('../routes/practices/claimed.js');
let listPractice = require('../routes/practices/list.js');
let callPractice = require('../routes/practices/call.js');

router.get(
  '/search/:search_type',
  handleRoute(getPractices, '[Error] Searching Practices')
);

router.get(
  '/services',
  cache.withTtl('1 day'),
  handleRoute(getPracticeServices, '[Error] Viewing Practice Services')
);

router.get(
  '/promos',
  handleRoute(getPracticePromos, '[Error] Viewing Practice Promos')
);

router.use(
  '/claim',
  claimPractice,
);

router.get(
  '/claimed',
  handleRoute(practiceClaimed, '[Error] Checking Claimed Practice')
);

router.use(
  '/list',
  listPractice
);

router.get(
  '/call',
  callPractice
);

module.exports = router;