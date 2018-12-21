let express = require('express');
let router = express.Router();

let util = require('util');
let placename = require('placename');
let getLocation = util.promisify(placename.bind(placename));

let handleRoute = require('../middlewares/handleRoute.js');

let { createBtn, createButtonMessage } = require('../libs/bots.js');

let getLocationRoute = async ({ query }) => {
  let { city, state } = query;

  if (city) {
    let yes_btn = createBtn(
      `Yes|show_block|Location Confirmed`,
      { profile_city: city }
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

let getCity = async ({ query }, res) => {
  let { profile_city } = query;

  let [{ name: city, country }] = await getLocation(profile_city);
  
  let set_attributes = { profile_city: city }

  res.send({ set_attributes });
}

router.get(
  '/',
  getLocationRoute
);

router.get(
  '/city',
  getCity
);

module.exports = router;