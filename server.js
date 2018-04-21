let express = require('express');
let app = express();

let handleAI = require('./routes/ai');

// Providers
let getProviders = require('./routes/getProviders');
let getProviderServices = require('./routes/getProviderServices');
let getProviderPromos = require('./routes/getProviderPromos');

// Promos
let getPromos = require('./routes/getPromos');
let getPromoDetails = require('./routes/getPromoDetails');
let getPromoProviders = require('./routes/getPromoProviders');

// Services
let getServices = require('./routes/getServices');
let getServiceDescription = require('./routes/getServiceDescription');
let getServiceProviders = require('./routes/getServiceProviders');

// ROUTES CONFIGURATION
app.get('/ai', handleAI);

// Providers
app.get('/providers/:search_type', getProviders);
app.get('/provider/services', getProviderServices);
app.get('/provider/promos', getProviderPromos);

// Promotions
app.get('/promos/:search_type', getPromos);
app.get('/promo/details', getPromoDetails);
app.get('/promo/providers', getPromoProviders);

// Services
app.get('/services/:service_type', getServices);
app.get('/service/description', getServiceDescription);
app.get('/service/providers', getServiceProviders);

app.listen(3000, () => console.log('Running on PORT 3000'));