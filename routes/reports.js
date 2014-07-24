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
  var condition = mg.parse(queryObject);

  var collection = mg.getCollection();
  collection.aggregate([
                        { $match : condition },
                        { $group : { _id : "$url", times : { $sum : 1 } } },
                        { $sort : { times : -1} },
                        { $limit : 10 },
                        { $project : { _id : 0, url : '$_id', times : 1 } }
                        ], function(err, result) {
    res.json(result);
  });
});

router.get('/top10url/byTotalSeconds', function(req, res) {
  var queryObject = {};
  if (req.query.query) {
    queryObject = JSON.parse(req.query.query);
  }
  var condition = mg.parse(queryObject);
  
  var collection = mg.getCollection();
  collection.aggregate([
                        { $match : condition },
                        { $group : { _id : "$url", totalSeconds : { $sum : '$elapsedSeconds' } } },
                        { $sort : { totalSeconds : -1} },
                        { $limit : 10 },
                        { $project : { _id : 0, url : '$_id', totalSeconds : 1 } }
                        ], function(err, result) {
    res.json(result);
  });
});

router.get('/top10url/bySeconds', function(req, res) {
  var queryObject = {};
  if (req.query.query) {
    queryObject = JSON.parse(req.query.query);
  }
  var condition = mg.parse(queryObject);
  
  var collection = mg.getCollection();
  collection.find(condition, { url : 1, elapsedSeconds : 1 }).sort({ elapsedSeconds : -1}).limit(10).toArray(function(err, result) {
    res.json(result);
  });
});

module.exports = router;
