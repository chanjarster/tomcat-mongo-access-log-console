var express = require('express');
var _ = require('underscore');
var mg = require('../util/mongoutil');

var router = express.Router();
/* GET users listing. */
router.get('/', function(req, res) {
  var collection = mg.getCollection();
  
  res.render('reports');
});

module.exports = router;
