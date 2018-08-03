let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');
let cache = require('../middlewares/cache.js');

let routerHandler = require('../routes/router_handler.js');

router.get(
  '/services',
  // cache.withTtl('1 day'),
  handleRoute(routerHandler, '[Error] User')
);

module.exports = router;