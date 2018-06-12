let express = require('express');
let router = express.Router();

let getPromos = require('./routes/promos/promos.js');
let getPromoDetails = require('./routes/promos/details.js');
let getPromoProvider = require('./routes/promos/provider.js');
let claimPromotion = require('./routes/promos/claim.js');
let viewClaimedPromos = require('./routes/promos/view/claimed.js');
// let viewPromoId = require('./routes/viewPromoId');

// Admin
let createManufacturedPromo = require('./routes/createManufacturedPromo');
let createCustomPromo = require('./routes/createCustomPromo');
let viewActivePromos = require('./routes/viewActivePromos');
let viewPromoInfo = require('./routes/viewPromoInfo');
let updatePromoInfo = require('./routes/updatePromoInfo');
let togglePromo = require('./routes/togglePromo');
let verifyPromo = require('./routes/verifyPromo');
let updateVerifiedPromo = require('./routes/updateVerifiedPromo');

router.get('/search/:search_type', getPromos);
router.get('/details', getPromoDetails);
router.get('/provider', getPromoProvider);
router.use('/claim', claimPromotion);
router.get('/view/claimed', viewClaimedPromos);

// Admin
router.use('/promo/new/manufactured', createManufacturedPromo);
router.use('/promo/new/custom', createCustomPromo);
router.get('/promo/view/all', viewActivePromos);
router.get('/promo/view/info', viewPromoInfo);
// router.get('/promo/view/id', viewPromoId);
router.use('/promo/update', updatePromoInfo);
router.get('/promo/toggle', togglePromo);
router.get('/promo/verify', verifyPromo);
router.get('/promo/verify/update', updateVerifiedPromo);

module.exports = router;