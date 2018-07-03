let express = require('express');
let app = express();

// Middlewares
let updateQueryParameter = require('./middlewares/updateQueryParameter.js');

// Routers
let AIRoute = require('./routes/ai.js');
let adminRouter = require('./routes/admin.js');
let practicesRouter = require('./routes/practices.js');
let promosRouter = require('./routes/promos.js');
let servicesRouter = require('./routes/services.js');

let getFile = require('./routes/files.js');

app.use(updateQueryParameter);

app.get('/ai', AIRoute);
app.use('/admin', adminRouter);
app.use('/practices', practicesRouter);
app.use('/promos', promosRouter);
app.use('/services', servicesRouter);

// Get Files
app.get('/files', getFile);

app.listen(3000, () => console.log('Running on PORT 3000'));