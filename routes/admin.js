let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');

let getAdminMenu = require('../routes/admin/menu.js');
let createCustomPromo = require('../routes/admin/promos/create/custom.js');
let createManufacturedPromo = require('../routes/admin/promos/create/manufactured.js');
let viewAllPromos = require('../routes/admin/promos/view/all.js');
let viewUserPromos = require('../routes/admin/promos/view/user.js');
let viewPromoInfo = require('../routes/admin/promos/view/info.js');
let updatePromoInfo = require('../routes/admin/promos/update.js');
let togglePromo = require('../routes/admin/promos/toggle.js');
let updateUserPromo = require('../routes/admin/promos/user/update.js');

router.get(
  '/menu', getAdminMenu
);

router.get(
  '/promos/create/custom', createCustomPromo
);

router.use(
  '/promos/create/manufactured', createManufacturedPromo
);

router.get(
  '/promos/view/all', viewAllPromos
);

router.get(
  '/promos/view/user', viewUserPromos
);

router.get(
  '/promos/view/info', viewPromoInfo
);

router.get(
  '/promos/update', updatePromoInfo
);

router.get(
  '/promos/toggle', togglePromo
);

router.get(
  '/promos/user/update', updateUserPromo
);

module.exports = router;