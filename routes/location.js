let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');

let { createBtn, createButtonMessage } = require('../libs/bots.js');

let getLocation = async ({ query }) => {
  let { city, state } = query;

  if (city) {
    let yes_btn = createBtn(
      `Yes|show_block|[JSON] Confirm Location`,
    );

    let no_btn = createBtn(
      `No|show_block|Get City`,
    );

    let msg = createButtonMessage(
      `So your city is ${city}, ${state}.`,
      yes_btn,
      no_btn,
    );
  }
}

router.get(
  '/',
  getLocation
);

module.exports = router;