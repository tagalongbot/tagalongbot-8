let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let swig = require('swig');

// Middlewares
let updateQueryParameter = require('./middlewares/updateQueryParameter.js');

// Routers
let AIRoute = require('./routes/ai.js');
let AITraining = require('./routes/ai-training.js');

let adminRouter = require('./routes/admin.js');

let getFile = require('./routes/files.js');

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.use(updateQueryParameter);

// AI Training
app.get('/ai', AIRoute);
app.post('/ai-training', AITraining);

app.use('/admin', adminRouter);

// Get Files
app.get('/files', getFile);
app.post('/files', getFile);

app.listen(3000, () => console.log('Running on PORT 3000'));