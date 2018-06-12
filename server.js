let express = require('express');
let app = express();

let AIRoute = require('./routes/ai');
let providersRouter = require('./routes/providers');
let promosRouter = require('./routes/promos');
let servicesRouter = require('./routes/service');

app.get('/ai', AIRoute);

app.listen(3000, () => console.log('Running on PORT 3000'));