let express_expeditious = require('express-expeditious');

// Our cache instance
let cache = express_expeditious({
  namespace: 'express',
  defaultTtl: '1 hour',
  engine: require('expeditious-engine-memory')()
});

module.exports = cache;