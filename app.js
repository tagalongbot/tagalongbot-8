require('dotenv').config();
let express = require('express');
let app = express();
let bodyParser = require('body-parser');

// Load Marko
require('marko/node-require');
let markoExpress = require('marko/express');

// Middlewares
let updateQueryParameter = require('./middlewares/updateQueryParameter.js');

// Routers
let peopleRoute = require('./routes/people.js');

app.use(
  express.static(__dirname + '/public')
);

app.use(
  bodyParser.json()
);

app.use(updateQueryParameter);

// Routers
app.use(
  '/people',
  peopleRoute
);

app.listen(3000, () => console.log('Running on PORT 3000'));