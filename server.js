let express = require('express');
let app = express();

let handleAI = require('./routes/ai');
let getProviderServices = require('./routes/getProviderServices');
let getServiceDescription = require('./routes/getServiceDescription');

app.get('/ai', handleAI);
app.get('/provider/services', getProviderServices);
app.get('/service/description', getServiceDescription);

app.listen(3000, () => console.log('Running on PORT 3000'));