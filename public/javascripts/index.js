define(
    [
      'javascripts/formView', 
      'javascripts/logListView', 
      'javascripts/queryBar',
      'javascripts/collectionInfoView'
    ],
    
    function(FormView, LogListView, QueryBar, CollectionInfoView) {
      
      return Backbone.View.extend({
       
        initialize : function() {
      
          this.eventBus = _.extend(Backbone.Events);
          
          var $searchForm = $('#searchForm'),
              $queryBar = $('#queryBar'),
              $logList = $("#logList"),
              $collectionInfo = $("#collection-info")
              ;
          
          new FormView({
            el : $searchForm,
            eventBus : this.eventBus
          });
          
          new QueryBar({
            el : $queryBar,
            $stickyBuddy : $logList,
            eventBus : this.eventBus
          });
          
          new LogListView({
            el : $logList,
            eventBus : this.eventBus
          });

          new CollectionInfoView({
            el : $collectionInfo,
            eventBus : this.eventBus
          });
          
        }
      
      });
   
});