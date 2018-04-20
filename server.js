let express = require('express');
let app = express();

let handleAI = require('./routes/ai');
let getProviderServices = require('./routes/getProviderServices');
let getProviderPromos = require('./routes/getProviderPromos');
let getPromoDetails = require('./routes/getPromoDetails');
let getPromoProviders = require('./routes/getPromoProviders');
let getServiceDescription = require('./routes/getServiceDescription');
let getServiceProviders = require('./routes/getServiceProviders');

app.get('/ai', handleAI);
// app.get('/providers', getProviders);
// app.get('/

// Providers
app.get('/provider/services', getProviderServices);
app.get('/provider/promos', getProviderPromos);

// Promotions
app.get('/promo/details', getPromoDetails);
app.get('/promo/providers', getPromoProviders);

//Services
app.get('/service/description', getServiceDescription);
app.get('/service/providers', getServiceProviders);

app.listen(3000, () => console.log('Running on PORT 3000'));