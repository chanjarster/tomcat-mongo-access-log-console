var express = require('express');
var _ = require('underscore');
var mg = require('../util/mongoutil');

var router = express.Router();
/* GET users listing. */
router.get('/top10url/byTimes', function(req, res) {
  var queryObject = {};
  if (req.query.query) {
    queryObject = JSON.parse(req.query.query);
  }
  
  var collection = mg.getCollection();
  collection.aggregate([
                        { $match : queryObject },
                        { $group : { _id : "$url", count : { $sum : 1 } } },
                        { $sort : { count : -1} },
                        { $limit : 10 },
                        { $project : { _id : 0, url : '$_id', count : 1 } }
                        ], function(err, result) {
    res.json(result);
  });
});

router.get('/top10url/byTotalSeconds', function(req, res) {
  var queryObject = {};
  if (req.query.query) {
    queryObject = JSON.parse(req.query.query);
  }
  
  var collection = mg.getCollection();
  collection.aggregate([
                        { $match : queryObject },
                        { $group : { _id : "$url", sumElapsedSeconds : { $sum : '$elapsedSeconds' } } },
                        { $sort : { sumElapsedSeconds : -1} },
                        { $limit : 10 },
                        { $project : { _id : 0, url : '$_id', sumElapsedSeconds : 1 } }
                        ], function(err, result) {
    res.json(result);
  });
});

router.get('/top10url/bySeconds', function(req, res) {
  var queryObject = {};
  if (req.query.query) {
    queryObject = JSON.parse(req.query.query);
  }
  
  var collection = mg.getCollection();
  collection.find(queryObject, { url : 1, elapsedSeconds : 1 }).sort({ elapsedSeconds : -1}).limit(10).toArray(function(err, result) {
    res.json(result);
  });
});

module.exports = router;
