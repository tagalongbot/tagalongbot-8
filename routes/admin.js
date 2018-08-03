let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');
let cache = require('../middlewares/cache.js');

// Helper Module
let adminHelpers = require('../routes/admin/helpers.js');

// Admin Menu
let getAdminMenu = require('../routes/admin/menu.js');
let getAdminAccess = require('../routes/admin/access.js');

// Leads
let getLeadsList = require('../routes/view.js');

router.use(
  '/helpers',
  adminHelpers
);

router.get(
  '/menu',
  // cache.withTtl('1 hour'),
  handleRoute(getAdminMenu, '[Error] Admin')
);

router.use(
  '/access',
  getAdminAccess
);

router.get(
  '/leads/view/:range',
  handleRoute(getLeadsList, '[Error] Admin')
);

module.exports = router;