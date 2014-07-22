define([], function() {
  
  return Backbone.View.extend({
    
    events : {
      'keypress *' : 'keypress'
    },
    
    initialize : function(options) {
      
      this.eventBus = options.eventBus;
      
      this.$conditions = this.$el.find('#conditions');
      
      // datepicker
      this.$el.find("[name='datetime{date}[gte]']").datepicker({ format : 'yyyy-mm-dd' });
      this.$el.find("[name='datetime{date}[lte]']").datepicker({ format : 'yyyy-mm-dd' });
      this.listenTo(this.eventBus, 'query:collect-params', this.collectParams);
    },
    
    collectParams : function() {
      
      var params = {};
      
      // build query condition
      _.each(this.$el.serialize().split('&'), function(component, index) {
        var keyValue = component.split('=');
        var key = decodeURIComponent(keyValue[0]);
        var value = decodeURIComponent(keyValue[1].replace(/\+/g,'%20')).trim();
        if (!value) {
          return;
        }
        params[key] = value;
      });
      
      _.each(['#params\\.sub', '#requestHeaders\\.sub', '#responseHeaders\\.sub', 
              '#cookies\\.sub', '#requestAttrs\\.sub', '#sessionAttrs\\.sub'], function(selector, index) {
        var pk = selector.replace('\\', '').replace('#', '').replace('.sub', '');
        
        // build post params query condition
        _.each($(selector).tagsinput('items'), function(item, value) {
          var keyValue = item.split('=');
          var key = keyValue[0].replace(/\./g, '$');
          var value = keyValue[1].replace(/^\s/g, '').replace(/\s$/g, '');
          if (!value) {
            return;
          }
          
          var ckey = pk + '.' + key + '{re}[eq]';
          
          if (!params[ckey]) {
            params[ckey] = value;
          } else {
            if(!_.isArray(params[ckey])) {
              var oldVal = params[ckey];
              params[ckey] = [];
              params[ckey].push(oldVal);
            }
            params[ckey].push(value);
          }
        });
      });
      
      console.log(params);
      this.eventBus.trigger('query:do', { params : params } );
      
    },
    
    keypress : function(event) {
      if (event.keyCode == 13) {
        this.collectParams();
      }
    }
  });
  
});