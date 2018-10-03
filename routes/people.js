let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');
let cache = require('../middlewares/cache.js');

let hasCreatedProfile = require('../routes/people/created.js');
let createPerson = require('../routes/people/create.js');
let searchPeople = require('../routes/people/search.js');
let requestPerson = require('../routes/people/request.js');
let checkIfPersonIsVerified = require('../routes/people/verified.js');
let verifyPerson = require('../routes/people/verify.js');

router.get(
  '/created',
  // cache.withTtl('1 day'),
  handleRoute(hasCreatedProfile, '[Error] User')
);

router.get(
  '/create',
  // cache.withTtl('1 day'),
  handleRoute(createPerson, '[Error] User')
);

router.get(
  '/search',
  // cache.withTtl('1 day'),
  handleRoute(searchPeople, '[Error] User')
);

router.use(
  '/request',
  // cache.withTtl('1 day'),
  requestPerson
);

router.get(
  '/verified',
  checkIfPersonIsVerified
);

router.get(
  '/verify',
  verifyPerson
);

module.exports = router;