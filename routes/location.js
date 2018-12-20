let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');

let getLocation = async ({ query }) => {
  let { city } = query;
  
}

router.get(
  '/created',
  // cache.withTtl('1 day'),
  handleRoute(hasCreatedProfile, '[Error] User')
);

module.exports = router;