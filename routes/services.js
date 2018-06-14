let express = require('express');
let router = express.Router();

let getServices = require('../routes/services/services.js');
// let getServiceDescription = require('../routes/services/description.js');
// let getServiceProviderPromos = require('../routes/services/provider/promos.js');
// let getServiceProviders = require('../routes/services/providers.js');

router.get('/search/:service_type', getServices);
// router.get('/description/:show_providers', getServiceDescription);
// router.use('/provider/promos', getServiceProviderPromos);
// router.use('/providers', getServiceProviders);

module.exports = router;