let express = require('express');
let app = express();

let handleAI = require('./routes/ai');
let getProviderServices = require('./routes/getProviderServices');
let getServiceDescription = require('./routes/getServiceDescription');
let getProviderPromos = require('./routes/getProviderPromos');
let getPromoDetails = require('./routes/getPromoDetails');
let getPromoProviders = require('./routes/getPromoProviders');

app.get('/ai', handleAI);
app.get('/provider/services', getProviderServices);
app.get('/provider/promos', getProviderPromos);
app.get('/promo/details', getPromoDetails);
app.get('/promo/providers', getPromoProviders);
app.get('/service/description', getServiceDescription);

app.listen(3000, () => console.log('Running on PORT 3000'));