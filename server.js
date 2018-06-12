let express = require('express');
let app = express();

let handleAI = require('./routes/ai');
let getAdminMenu = require('./routes/getAdminMenu');

let providersRouter = require('./routes/providers');
let promosRouter = require('./routes/promos');
let servicesRouter = require('./routes/service');

// ROUTES CONFIGURATION
app.get('/ai', handleAI);
app.get('/admin/menu', getAdminMenu);


app.listen(3000, () => console.log('Running on PORT 3000'));