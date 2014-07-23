/**
 * top 10 url view
 */
define([], function() {
  
  return Backbone.View.extend({
    
    events : {
      'click .byTimes' : 'triggerByTimes',
      'click .byTotalSeconds' : 'triggerByTotalSeconds',
      'click .bySeconds' : 'triggerBySeconds',
    },
    
    initialize : function(options) {
      
      this.eventBus = options.eventBus;
      this.listenTo(this.eventBus, 'top10url:open', function() {
        $("#top10urlModal").modal();
      });
      this.listenTo(this.eventBus, 'top10url:byTimes:do', this.byTimes);
      this.listenTo(this.eventBus, 'top10url:byTotalSeconds:do', this.byTotalSeconds);
      this.listenTo(this.eventBus, 'top10url:bySeconds:do', this.bySeconds);
    },
    
    triggerByTimes : function() {
      this.eventBus.trigger('query:collect-params', 'top10url:byTimes:do');
    },
    
    triggerByTotalSeconds : function() {
      this.eventBus.trigger('query:collect-params', 'top10url:byTotalSeconds:do');
    },
    
    triggerBySeconds : function() {
      this.eventBus.trigger('query:collect-params', 'top10url:bySeconds:do');
    },
    
    byTimes : function(queryOption) {
       $.get('/reports/top10url/byTimes', {
          query : JSON.stringify(queryOption.params)
       }, function(result) {
         console.log(result);
       }, 'json');
    },
    
    byTotalSeconds : function(queryOption) {
      $.get('/reports/top10url/byTotalSeconds', {
        query : JSON.stringify(queryOption.params)
      }, function(result) {
        console.log(result);
      }, 'json');
    },
    
    bySeconds : function(queryOption) {
      $.get('/reports/top10url/bySeconds', {
        query : JSON.stringify(queryOption.params)
      }, function(result) {
        console.log(result);
      }, 'json');
    },
    
    
  });
  
});
