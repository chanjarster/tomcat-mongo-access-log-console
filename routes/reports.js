var express = require('express');

var top10url = require('./reports/top10url');
var requestStats = require('./reports/requestStats');

var router = express.Router();

router.use('/top10url', top10url);
router.use('/requestStats', requestStats);

module.exports = router;