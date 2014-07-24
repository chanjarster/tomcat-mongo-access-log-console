/**
 * top 10 url view
 */
define([
        'text!templates/top10url/byTimes.html',
        'text!templates/top10url/byTotalSeconds.html',
        'text!templates/top10url/bySeconds.html'
        ], 
  function(byTimesTemplate, byTotalSeconds, bySeconds) {
  
  var byTimesTmpl = _.template(byTimesTemplate);
  var byTotalSecondsTmpl = _.template(byTotalSeconds);
  var bySecondsTmpl = _.template(bySeconds);
  
  return Backbone.View.extend({
    
    events : {
      'click .byTimes' : 'triggerByTimes',
      'click .byTotalSeconds' : 'triggerByTotalSeconds',
      'click .bySeconds' : 'triggerBySeconds',
    },
    
    initialize : function(options) {
      
      this.eventBus = options.eventBus;
      this.$table = this.$el.find('table');
      this.listenTo(this.eventBus, 'top10url:open', function() {
        $("#top10urlModal").modal();
        this.$el.find('.byTimes').click();
      }, this);
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
       var that = this;
       $.get('/reports/top10url/byTimes', {
          query : JSON.stringify(queryOption.params)
       }, function(result) {
         that.$table.html(byTimesTmpl( { items : result }));
       }, 'json');
    },
    
    byTotalSeconds : function(queryOption) {
      var that = this;
      $.get('/reports/top10url/byTotalSeconds', {
        query : JSON.stringify(queryOption.params)
      }, function(result) {
        that.$table.html(byTotalSecondsTmpl( { items : result }));
      }, 'json');
    },
    
    bySeconds : function(queryOption) {
      var that = this;
      $.get('/reports/top10url/bySeconds', {
        query : JSON.stringify(queryOption.params)
      }, function(result) {
        that.$table.html(bySecondsTmpl( { items : result }));
      }, 'json');
    },
    
    
  });
  
});
