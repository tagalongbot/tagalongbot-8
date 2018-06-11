let express = require('express');
let router = express.Router();

let getProviders = require('./routes/providers/getProviders');
let getProviderServices = require('./routes/providers/services');
let getProviderPromos = require('./routes/getProviderPromos');
let claimProvider = require('./routes/claimProvider');
let providerClaimed = require('./routes/providerClaimed');
let listProvider = require('./routes/listProvider');




module.exports = router;