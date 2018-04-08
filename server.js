let express = require('express');
let app = express();

let handleAI = require('./routes/ai');
let getProviderServices = require('./routes/getProviderServices');
// let exportData = require('./routes/export-data');

app.get('/ai', handleAI);
app.get('/provider/services', getProviderServices);
// app.get('/export-data', exportData);

app.listen(3000, () => console.log('Running on PORT 3000'));