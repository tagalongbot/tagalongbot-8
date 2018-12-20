let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');

router.get(
  '/created',
  // cache.withTtl('1 day'),
  handleRoute(hasCreatedProfile, '[Error] User')
);

module.exports = router;