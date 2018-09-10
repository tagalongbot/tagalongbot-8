let express = require('express');
let app = express();
let bodyParser = require('body-parser');

// Middlewares
let updateQueryParameter = require('./middlewares/updateQueryParameter.js');

// Routers
let runnersRoute = require('./routes/runners.js');

app.use(
  express.static(__dirname + '/public')
);

app.use(
  bodyParser.json()
);

app.use(updateQueryParameter);

// Routers
app.use(
  '/runners',
  runnersRoute
);

app.listen(3000, () => console.log('Running on PORT 3000'));