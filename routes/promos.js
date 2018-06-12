let express = require('express');
let router = express.Router();

let getPromos = require('./routes/promos/promos.js');
let getPromoDetails = require('./routes/promos/details.js');
let getPromoProvider = require('./routes/promos/provider.js');
let claimPromotion = require('./routes/promos/claim.js');
let viewClaimedPromos = require('./routes/promos/view/claimed.js');
// let viewPromoId = require('./routes/viewPromoId');

router.get('/search/:search_type', getPromos);
router.get('/details', getPromoDetails);
router.get('/provider', getPromoProvider);
router.use('/claim', claimPromotion);
router.get('/view/claimed', viewClaimedPromos);
// router.get('/promo/view/id', viewPromoId);

module.exports = router;