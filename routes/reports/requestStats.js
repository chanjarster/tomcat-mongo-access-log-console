var express = require('express');
var _ = require('underscore');
var moment = require('moment');
var mg = require('../../util/mongoutil');

var router = express.Router();

var reduce = function(key, values) {
  return Array.sum(values);
};

router.get('/last24hours', function(req, res) {
  var queryObject = {};
  if (req.query.query) {
    queryObject = JSON.parse(req.query.query);
  }
  var condition = mg.parse(queryObject);
  
  var startOn =  moment().subtract(24, 'hours').startOf('hour').toDate();
  condition['datetime'] = { $gte : startOn };
  
  var datas = {};
  datas[moment(startOn).format('HH')] = 0;
  _.times(24, function(n) {
    datas[moment(startOn).add(n + 1, 'hours').format('HH')] = 0;
  });
  
  
  var collection = mg.getCollection();
  collection.mapReduce(
      function() {
        var hour = this.datetime.getHours();
        hour = hour < 10 ? '0' + hour : '' + hour;
        emit(hour, 1);
      },
      reduce,
      {
        query : condition,
        out : { inline : 1 },
        sort : { datetime : 1},
        verbose:true
      },
      function(error, result) {
        if (error) {
          console.log(error);
        }
        _.each(result, function(element) {
          datas[element['_id']] = element['value'];
        });
        var chart = {};
        chart.title = 'Last 24 hours';
        chart.xAxis = { categories : _.keys(datas) };
        chart.yAxis = { title : { text : 'request times' }};
        chart.series = { name : 'request times', data : _.values(datas) };
        
        res.json(chart);
      }
    );
});

router.get('/last7days', function(req, res) {
  var queryObject = {};
  if (req.query.query) {
    queryObject = JSON.parse(req.query.query);
  }
  var condition = mg.parse(queryObject);
  
  var startOn =  moment().subtract(7, 'days').startOf('day').toDate();
  condition['datetime'] = { $gte : startOn };
  
  var datas = {};
  datas[moment(startOn).format('MM/DD')] = 0;
  _.times(7, function(n) {
    datas[moment(startOn).add(n + 1, 'days').format('MM/DD')] = 0;
  });
  
  var collection = mg.getCollection();
  collection.mapReduce(
      function() {
        var month = this.datetime.getMonth() + 1;
        month = month < 10 ? '0' + month : '' + month;
        var date = this.datetime.getDate();
        date = date < 10 ? '0' + date : '' + date;
        emit(month + '/' + date, 1);
      },
      reduce,
      {
        query : condition,
        out : { inline : 1 },
        sort : { datetime : 1},
        verbose:true
      },
      function(error, result) {
        if (error) {
          console.log(error);
        }
        _.each(result, function(element) {
          datas[element['_id']] = element['value'];
        });
        var chart = {};
        chart.title = 'Last 7 days';
        chart.xAxis = { categories : _.keys(datas) };
        chart.yAxis = { title : { text : 'request times' }};
        chart.series = { name : 'request times', data : _.values(datas) };
        
        res.json(chart);
      }
    );
});

router.get('/last30days', function(req, res) {
  var queryObject = {};
  if (req.query.query) {
    queryObject = JSON.parse(req.query.query);
  }
  var condition = mg.parse(queryObject);
  
  var startOn =  moment().subtract(30, 'days').startOf('day').toDate();
  condition['datetime'] = { $gte : startOn };
  
  var datas = {};
  datas[moment(startOn).format('MM/DD')] = 0;
  _.times(30, function(n) {
    datas[moment(startOn).add(n + 1, 'days').format('MM/DD')] = 0;
  });
  
  var collection = mg.getCollection();
  collection.mapReduce(
      function() {
        var month = this.datetime.getMonth() + 1;
        month = month < 10 ? '0' + month : '' + month;
        var date = this.datetime.getDate();
        date = date < 10 ? '0' + date : '' + date;
        emit(month + '/' + date, 1);
      },
      reduce,
      {
        query : condition,
        out : { inline : 1 },
        verbose:true
      },
      function(error, result) {
        if (error) {
          console.log(error);
        }
        _.each(result, function(element) {
          datas[element['_id']] = element['value'];
        });
        var chart = {};
        chart.title = 'Last 30 days';
        chart.xAxis = { categories : _.keys(datas) };
        chart.yAxis = { title : { text : 'request times' }};
        chart.series = { name : 'request times', data : _.values(datas) };
        
        res.json(chart);
      }
    );
  
});


module.exports = router;
