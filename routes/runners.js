let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');
let cache = require('../middlewares/cache.js');

let searchRunners = require('../routes/runners/search.js');

router.get(
  '/search/:zip_code',
  // cache.withTtl('1 day'),
  handleRoute(searchRunners, '[Error] User')
);

module.exports = router;