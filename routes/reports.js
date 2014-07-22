var express = require('express');
var _ = require('underscore');
var mg = require('../util/mongoutil');

var router = express.Router();
/* GET users listing. */
router.get('/top10url/byTimes', function(req, res) {
  var collection = mg.getCollection();
  collection.aggregate([
                        { $sort : { count : -1} },
                        { $group : { _id : "$url", count : { $sum : 1 } } },
                        { $limit : 10}
                        ], function(err, result) {
    res.json(result);
  });
});

router.get('/top10url/bySumElapsedSeconds', function(req, res) {
  var collection = mg.getCollection();
  collection.aggregate([
                        { $sort : { count : -1} },
                        { $group : { _id : "$url", sumElapsedSeconds : { $sum : '$elapsedSeconds' } } },
                        { $limit : 10}
                        ], function(err, result) {
    res.json(result);
  });
});

router.get('/top10url/byElapsedSeconds', function(req, res) {
  var collection = mg.getCollection();
  collection.aggregate([
                        { $sort : { elapsedSeconds : 1} },
                        { $group : { _id : { url : '$url', elapsedSeconds : '$elapsedSeconds' } } },
                        { $limit : 10}
                        ], function(err, result) {
    res.json(result);
  });
});

module.exports = router;
