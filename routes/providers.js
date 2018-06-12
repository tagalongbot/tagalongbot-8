let express = require('express');
let router = express.Router();

let getProviders = require('./routes/providers/providers.js');
let getProviderServices = require('./routes/providers/services.js');
let getProviderPromos = require('./routes/providers/promos.js');
let claimProvider = require('./routes/providers/claim.js');
let providerClaimed = require('./routes/providers/claimed.js');
let listProvider = require('./routes/providers/list.js');

router.get('/search/:search_type', getProviders);
router.get('/services', getProviderServices);
router.get('/promos', getProviderPromos);
router.get('/claim', claimProvider);
router.get('/claimed', providerClaimed);
router.get('/list', listProvider);

module.exports = router;