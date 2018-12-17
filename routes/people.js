let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');
let cache = require('../middlewares/cache.js');

let hasCreatedProfile = require('../routes/people/created.js');
let createPerson = require('../routes/people/create.js');
let getProfileImage = require('../routes/people/create/getImage.js');
let searchPeople = require('../routes/people/search.js');
let tagPerson = require('../routes/people/tag.js');

// Views
let viewProfileWebview = require('../routes/people/view/profile.js');
let viewProfileInterests = require('../routes/people/view/interests.js');
let viewProfileProfessions = require('../routes/people/view/professions.js');
let viewProfilePhotos = require('../routes/people/view/photos.js');
let viewProfileTags = require('../routes/people/view/tags.js');

// Update
let updatePreferences = require('../routes/people/update/preferences.js');
let updateSettings = require('../routes/people/update/settings.js');
let updatePhoneNumber = require('../routes/people/update/phone_number.js');
let updateInterests = require('../routes/people/update/interests.js');
let updateProfessions = require('../routes/people/update/professions.js');
let updateProfile = require('../routes/people/update/profile.js');
let uploadProfileImage = require('../routes/people/update/image/upload.js');
let deleteProfileImage = require('../routes/people/update/image/delete.js');

// Danger Zone
let deleteProfile = require('../routes/people/delete.js');

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
  '/tag',
  // cache.withTtl('1 day'),
  tagPerson
);

router.get(
  '/view/profile',
  viewProfileWebview
);

router.get(
  '/view/interests',
  viewProfileInterests
);

router.get(
  '/view/professions',
  viewProfileProfessions
);

router.get(
  '/view/photos',
  viewProfilePhotos
);

router.get(
  '/view/tags',
  viewProfileTags
);

router.get(
  '/update/preferences',
  updatePreferences
);

router.get(
  '/update/settings',
  updateSettings
);

router.get(
  '/update/phone_number',
  updatePhoneNumber
);

router.post(
  '/update/interests',
  updateInterests
);

router.post(
  '/update/professions',
  updateProfessions
);

router.get(
  '/update/profile',
  updateProfile
);

router.get(
  '/update/image/upload',
  uploadProfileImage
);

router.get(
  '/update/image/delete',
  deleteProfileImage
);

router.get(
  '/delete',
  deleteProfile
);

module.exports = router;