let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');

let getAdminMenu = require('../routes/admin/menu.js');
let createCustomPromo = require('../routes/admin/promos/create/custom.js');
let createManufacturedPromo = require('../routes/admin/promos/create/manufactured.js');
let viewManufacturedPromoDetails = require('../routes/admin/promos/view/manufactured/details.js');
let viewAllPromos = require('../routes/admin/promos/view/all.js');
let viewUserPromos = require('../routes/admin/promos/view/user.js');
let viewPromoInfo = require('../routes/admin/promos/view/info.js');
let updatePromoInfo = require('../routes/admin/promos/update.js');
let togglePromo = require('../routes/admin/promos/toggle.js');
let updateUserPromo = require('../routes/admin/promos/user/update.js');

router.get(
  '/menu', 
  handleRoute(getAdminMenu, '[Error] Admin Menu')
);

router.use(
  '/promos/create/custom', 
  createCustomPromo,
);

router.use(
  '/promos/create/manufactured', 
  handleRoute(createManufacturedPromo, '[Error] Create Manufactured Promo')
);

router.get(
  '/promos/view/manufactured/details',
  handleRoute(viewManufacturedPromoDetails, '[Error] Viewing Manufactured Promo Details')
);

router.get(
  '/promos/view/all',
  handleRoute(viewAllPromos, '[Error] Viewing All Promos')
);

router.get(
  '/promos/view/user',
  handleRoute(viewUserPromos, '[Error] Viewing User Promos')
);

router.get(
  '/promos/view/info',
  handleRoute(viewPromoInfo, '[Error] Viewing Promo Info')
);

router.use(
  '/promos/update', 
  handleRoute(updatePromoInfo, '[Error] Updating Promo')
);

router.get(
  '/promos/toggle', 
  handleRoute(togglePromo, '[Error] Toggling Promos')
);

router.get(
  '/promos/user/update', 
  handleRoute(updateUserPromo, '[Error] Updating User Promo')
);

module.exports = router;