/**
 * log view (tr)
 */
define(
    ['text!templates/logTemplate.html'], 
    function(logTemplate) {
  
      return Backbone.View.extend({
        
        tagName : 'tr',
        
        rowTmpl : _.template(logTemplate),
        
        events : {
          'click a' : 'info'
        },
        
        initialize : function(options) {
          this.model = options.model;
          this.eventBus = options.eventBus;
        },
        
        render: function() {
          this.$el.html(this.rowTmpl( { d : this.model } ));
          return this.$el;
        },
        
        info : function(event) {
          this.eventBus.trigger('detail:refresh', this.model);
          event.preventDefault();
        }
        
      });

});