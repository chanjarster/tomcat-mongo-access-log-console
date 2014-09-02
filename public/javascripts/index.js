define(
    [
      'javascripts/formView', 
      'javascripts/logListView', 
      'javascripts/queryBar',
      'javascripts/collectionInfoView',
      'javascripts/top10urlView',
      'javascripts/detailView',
      'javascripts/requestStatsView',
    ],
    
    function(FormView, LogListView, QueryBar, CollectionInfoView, Top10urlView, DetailView, RequestStatsView) {
      
      return Backbone.View.extend({
       
        initialize : function() {
      
          this.eventBus = _.extend(Backbone.Events);
          
          var $searchForm = $('#searchForm')
              , $queryBar = $('#queryBar')
              , $logList = $("#logList")
              , $collectionInfo = $("#collection-info")
              , $top10url = $('#top10urlModal')
              , $detail = $('#detailModal')
              , $requestStats = $('#requestStatsModal');
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
          
          new Top10urlView({
            el : $top10url,
            eventBus : this.eventBus
          });
          
          new DetailView({
            el : $detail,
            eventBus : this.eventBus
          });
          
          new RequestStatsView({
            el : $requestStats,
            eventBus : this.eventBus
          });
          
        }
      
      });
   
});