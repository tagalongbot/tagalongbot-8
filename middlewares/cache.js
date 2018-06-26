var cache = require('express-redis-cache')({});

// let express_expeditious = require('express-expeditious');
// let expeditious_redis = require('expeditious-engine-redis');

// Our cache instance
// let cache = express_expeditious({
//   namespace: 'express',
//   defaultTtl: '1 hour',
//   engine: expeditious_redis({})
// });

module.exports = cache;