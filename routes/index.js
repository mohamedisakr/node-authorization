// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;
'use strict';

const accountRoute = require('./account');
const adminRoute = require('./admin');
const userRoute = require('./profile');
const managerRoute = require('./manager');

module.exports = {
  accountRoute, adminRoute, userRoute, managerRoute
};
