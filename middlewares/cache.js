let express_expeditious = require('express-expeditious');
let expeditious = require('expeditious');

// Our cache instance
let cache = expeditious({
  // Namespace for this cache
  namespace: 'express',
  // Default expiry
  defaultTtl: (120 * 1000),
  // Where items are stored
  engine: require('expeditious-engine-memory')()
});

// Middleware instance
let expressCache = require('express-expeditious')({
  expeditious: cache,
  statusCodeExpires: {
    // We don't want to cache these for the 2 minute default
    500: (30 * 1000),
    502: (60 * 1000)
  }
});

module.exports = expressCache;