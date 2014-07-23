/**
 * log detail view
 */
define(['text!templates/detailTemplate.html'], function(detailTemplate) {
  
  return Backbone.View.extend({
    
    detailTmpl : _.template(detailTemplate),
    
    initialize : function(options) {
      
      this.$table = this.$el.find('table');
      this.eventBus = options.eventBus;
      this.listenTo(this.eventBus, 'detail:refresh', function(model) {
        this.$table.html(this.detailTmpl( { d : model }));
        this.$el.modal();
      }, this);
      
    }
  
  });
});