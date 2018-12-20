let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');

let { createBtn, createButtonMessage } = require('../libs/bots.js');

let getLocation = async ({ query }) => {
  let { city } = query;

  if (city) {
    let btn = createBtn();

    let msg = createButtonMessage(
      ``,
    );
  }
}

router.get(
  '/',
  getLocation
);

module.exports = router;