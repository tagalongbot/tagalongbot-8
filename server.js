let express = require('express');
let app = express();

// Middlewares
let updateQueryParameter = require('./middlewares/updateQueryParameter.js');

// Routers
let AIRoute = require('./routes/ai.js');
let adminRouter = require('./routes/admin.js');
// let providersRouter = require('./routes/providers.js');
// let promosRouter = require('./routes/promos.js');
// let servicesRouter = require('./routes/service.js');

app.use(updateQueryParameter);

app.get('/ai', AIRoute);
app.use('/admin', adminRouter);
// app.use('/providers', providersRouter);
// app.use('/promos', promosRouter);
// app.use('/services', servicesRouter);

app.listen(3000, () => console.log('Running on PORT 3000'));