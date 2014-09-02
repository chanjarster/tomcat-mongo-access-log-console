/**
 * top 10 url view
 */
define([], 
  function(last24hoursTemplate, last7days, last30days) {
  
  return Backbone.View.extend({
    
    events : {
      'click .last-24-hours' : 'triggerLast24Hours',
      'click .last-7-days'  : 'triggerLast7Days',
      'click .last-30-days' : 'triggerLast30Days',
    },
    
    initialize : function(options) {
      
      this.eventBus = options.eventBus;
      this.$table = this.$el.find('table');
      var that = this;
      this.$el.on('shown.bs.modal', function() {
        that.$el.find('.last-24-hours').click();
        that.$el.find('.last-24-hours').addClass('active');
      });
      this.listenTo(this.eventBus, 'requestStats:open', function() {
        this.$el.modal();
      }, this);
      this.listenTo(this.eventBus, 'requestStats:last24hours:do', this.last24hours);
      this.listenTo(this.eventBus, 'requestStats:last7days:do', this.last7days);
      this.listenTo(this.eventBus, 'requestStats:last30days:do', this.last30days);
    },
    
    triggerLast24Hours : function() {
      this.$el.find('button').removeClass('active');
      this.eventBus.trigger('query:collect-params', 'requestStats:last24hours:do');
    },
    
    triggerLast7Days : function() {
      this.$el.find('button').removeClass('active');
      this.eventBus.trigger('query:collect-params', 'requestStats:last7days:do');
    },
    
    triggerLast30Days : function() {
      this.$el.find('button').removeClass('active');
      this.eventBus.trigger('query:collect-params', 'requestStats:last30days:do');
    },
    
    last24hours : function(queryOption) {
       var that = this;
       $.get('/reports/requestStats/last24hours', {
          query : JSON.stringify(queryOption.params)
       }, function(result) {
         that.renderChart(result);
       }, 'json');
    },
    
    last7days : function(queryOption) {
      var that = this;
      $.get('/reports/requestStats/last7days', {
        query : JSON.stringify(queryOption.params)
      }, function(result) {
        that.renderChart(result);
      }, 'json');
    },
    
    last30days : function(queryOption) {
      var that = this;
      $.get('/reports/requestStats/last30days', {
        query : JSON.stringify(queryOption.params)
      }, function(result) {
        that.renderChart(result);
      }, 'json');
    },
    
    renderChart : function(chart) {
      this.$el.find('.chart').highcharts({
          chart: {
              type: 'line'
          },
          title: {
              text: chart.title
          },
          xAxis: {
              categories: chart.xAxis.categories
          },
          yAxis: {
              title: {
                  text: chart.yAxis.title.text
              }
          },
          series: [{
              name: chart.series.name,
              data: chart.series.data
          }]
      });
    }
    
  });
  
});
