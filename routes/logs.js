var express = require('express');
var moment = require('moment');
var _ = require('underscore');
var mg = require('../util/mongoutil');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  var queryObject = {};
  if (req.query.query) {
    queryObject = JSON.parse(req.query.query);
  }
  var pageNo = parseInt(req.param('pageNo') ? req.param('pageNo') : '1');
  var limit = parseInt(req.param('limit') ? req.param('limit') : '20');
  
  var condition = mg.parse(queryObject);
  
  var collection = mg.getCollection();
  
  collection.stats(function(err, stats) {
    
    if (err) {
      throw err;
    }
    
    collection.find(condition).count(function(err, count) {
      
      collection
      .find(condition)
      .skip((pageNo - 1) * limit)
      .limit(limit).sort( { datetime : -1 } )
      .toArray(function(err, results) {
        if (err) {
          throw err;
        }
        
        for(var i = 0; i < results.length; i++) {
          results[i].datetime = moment(results[i].datetime).format('YYYY-MM-DD HH:mm:ss');
        }
        
        var paginationList = {
            logs : results,
            pageNo : pageNo,
            limit : limit,
            count : count,
            stats : stats
        };
        res.json(paginationList);
      });
      
    });
    
  });
  
  
});

var toDate = function(datestring) {
  return moment(datestring, 'YYYY-MM-DD').toDate();
};

var filterRegexCharacter = function(string) {
  _.each(['\\', '.', '(', ')', '[', ']', '^', '$', '+', '*'], function(c) {
     string = string.replace(new RegExp('\\' + c, 'g'), '\\' + c);
  });
  return string;
  
};

module.exports = router;
