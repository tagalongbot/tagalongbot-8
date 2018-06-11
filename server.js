let express = require('express');
let app = express();

let handleAI = require('./routes/ai');
let getAdminMenu = require('./routes/getAdminMenu');

// Providers
let getProviders = require('./routes/getProviders');
let getProviderServices = require('./routes/getProviderServices');
let getProviderPromos = require('./routes/getProviderPromos');
let claimProvider = require('./routes/claimProvider');
let providerClaimed = require('./routes/providerClaimed');
let listProvider = require('./routes/listProvider');

// Promos
let getPromos = require('./routes/getPromos');
let getPromoDetails = require('./routes/getPromoDetails');
let getPromoProvider = require('./routes/getPromoProvider');
let claimPromotion = require('./routes/claimPromotion');
let createManufacturedPromo = require('./routes/createManufacturedPromo');
let createCustomPromo = require('./routes/createCustomPromo');
let viewActivePromos = require('./routes/viewActivePromos');
let viewPromoInfo = require('./routes/viewPromoInfo');
let viewClaimedPromos = require('./routes/viewClaimedPromos');
let viewPromoId = require('./routes/viewPromoId');
let updatePromoInfo = require('./routes/updatePromoInfo');
let togglePromo = require('./routes/togglePromo');
let verifyPromo = require('./routes/verifyPromo');
let updateVerifiedPromo = require('./routes/updateVerifiedPromo');

// Services
let getServices = require('./routes/getServices');
let getServiceDescription = require('./routes/getServiceDescription');
let getServiceProviderPromos = require('./routes/getServiceProviderPromos');
let getServiceProviders = require('./routes/getServiceProviders');

// ROUTES CONFIGURATION
app.get('/ai', handleAI);
app.get('/admin/menu', getAdminMenu);

// Providers
app.get('/search/providers/:search_type', getProviders);
app.get('/provider/services', getProviderServices);
app.get('/provider/promos', getProviderPromos);
app.use('/provider/claim', claimProvider);
app.get('/provider/claimed', providerClaimed);
app.get('/provider/list', listProvider);

// Promotions
app.get('/search/promos/:search_type', getPromos);
app.get('/promo/details', getPromoDetails);
app.get('/promo/provider', getPromoProvider);
app.use('/promo/claim', claimPromotion);
app.use('/promo/new/manufactured', createManufacturedPromo);
app.use('/promo/new/custom', createCustomPromo);
app.get('/promo/view/all', viewActivePromos);
app.get('/promo/view/info', viewPromoInfo);
app.get('/promo/view/claimed', viewClaimedPromos);
app.get('/promo/view/id', viewPromoId);
app.use('/promo/update', updatePromoInfo);
app.get('/promo/toggle', togglePromo);
app.get('/promo/verify', verifyPromo);
app.get('/promo/verify/update', updateVerifiedPromo);

// Services
app.get('/search/services/:service_type', getServices);
app.get('/service/description/:show_providers', getServiceDescription);
app.use('/service/provider/promos', getServiceProviderPromos);
app.use('/service', getServiceProviders);

app.listen(3000, () => console.log('Running on PORT 3000'));