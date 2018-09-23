let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');
let cache = require('../middlewares/cache.js');

let createPerson = require('../routes/people/create.js');
let searchPeople = require('../routes/people/search.js');
let requestPerson = require('../routes/people/request.js');

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

module.exports = router;