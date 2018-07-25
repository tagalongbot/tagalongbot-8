let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');
let cache = require('../middlewares/cache.js');

// Admin Menu
let getAdminMenu = require('../routes/admin/menu.js');
let getAdminAccess = require('../routes/admin/access.js');

// Promos
let createCustomPromo = require('../routes/admin/promos/create/custom.js');
let createManufacturedPromo = require('../routes/admin/promos/create/manufactured.js');
let viewManufacturedPromoDetails = require('../routes/admin/promos/view/manufactured/details.js');
let viewAllPromos = require('../routes/admin/promos/view/all.js');
let viewPromoInfo = require('../routes/admin/promos/view/info.js');
let updatePromoInfo = require('../routes/admin/promos/update.js');
let togglePromo = require('../routes/admin/promos/toggle.js');
let updateUserPromo = require('../routes/admin/promos/user/update.js');

// Leads
let getLeadsList = require('../routes/admin/leads/view.js');

router.get(
  '/menu',
  // cache.withTtl('1 hour'),
  handleRoute(getAdminMenu, '[Error] Admin')
);

router.use(
  '/access',
  getAdminAccess
);

router.use(
  '/promos/create/custom', 
  createCustomPromo,
);

router.use(
  '/promos/create/manufactured', 
  createManufacturedPromo,
);

router.get(
  '/promos/view/manufactured/details',
  // cache.withTtl('1 day'),
  handleRoute(viewManufacturedPromoDetails, '[Error] Admin')
);

router.get(
  '/promos/view/all',
  handleRoute(viewAllPromos, '[Error] Admin')
);

router.get(
  '/promos/view/info',
  handleRoute(viewPromoInfo, '[Error] Admin')
);

router.use(
  '/promos/update', 
  updatePromoInfo
);

router.get(
  '/promos/toggle', 
  handleRoute(togglePromo, '[Error] Admin')
);

router.get(
  '/promos/user/update', 
  handleRoute(updateUserPromo, '[Error] Admin')
);

router.get(
  '/leads/view/:range',
  handleRoute(getLeadsList, '[Error] Getting Leads List')
);

module.exports = router;