let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');
let cache = require('../middlewares/cache.js');

let savePerson = require('../routes/people/save.js');
let hasCreatedProfile = require('../routes/people/created.js');
let createPerson = require('../routes/people/create.js');
let getProfileImage = require('../routes/people/create/getImage.js');
let searchPeople = require('../routes/people/search.js');
let requestPerson = require('../routes/people/request.js');
let checkIfPersonIsVerified = require('../routes/people/verified.js');
let verifyPerson = require('../routes/people/verify.js');
let viewProfileWebview = require('../routes/people/view/profile.js');

//Update
let updatePreferences = require('../routes/people/update/preferences.js');

router.get(
  '/save',
  // cache.withTtl('1 day'),
  handleRoute(savePerson, '[Error] User')
);

router.get(
  '/created',
  // cache.withTtl('1 day'),
  handleRoute(hasCreatedProfile, '[Error] User')
);

router.get(
  '/create',
  // cache.withTtl('1 day'),
  handleRoute(createPerson, '[Error] User')
);

router.get(
  '/create/getImage',
  // cache.withTtl('1 day'),
  handleRoute(getProfileImage, '[Error] User')
);

router.get(
  '/search',
  // cache.withTtl('1 day'),
  handleRoute(searchPeople, '[Error] User')
);

router.use(
  '/request',
  // cache.withTtl('1 day'),
  requestPerson
);

router.get(
  '/verified',
  checkIfPersonIsVerified
);

router.get(
  '/verify',
  verifyPerson
);

router.get(
  '/view/profile',
  viewProfileWebview
);

router.get(
  '/update/preferences',
  updatePreferences
);

module.exports = router;