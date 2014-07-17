define(
    [
      'javascripts/formView', 'javascripts/logListView', 'javascripts/paginationView',
      'javascripts/humanReadableSize'
    ],
    
    function(FormView, LogListView, PaginationView, humanReadableSize) {
      
      return Backbone.View.extend({
       
        initialize : function() {
      
          /**
           * Form View, Log List View, Each Log View
           */
          this.eventBus = _.extend(Backbone.Events);
          
          var $searchForm = $('#searchForm'),
              $pagination = $('#pagination'),
              $logList = $("#logList");
          
          new FormView({
            el : $searchForm,
            eventBus : this.eventBus
          });
          
          new PaginationView({
            el : $pagination,
            eventBus : this.eventBus
          });
          
          new LogListView({
            el : $logList,
            eventBus : this.eventBus
          });

          var $collectionInfo = $('#collection-info');
          this.listenTo(this.eventBus, 'update:collection-info', function(stats) {
            var infoTmpl = _.template("count:<%= count %>, size:<%= size %>, storageSize:<%= storageSize %>");
            var v = {};
            v.count = stats.count;
            v.size = humanReadableSize(stats.size);
            if (!stats.storageSize) {
              v.storageSize = 'unlimited';
            } else {
              v.storageSize = humanReadableSize(stats.storageSize);
            }
            $collectionInfo.html(infoTmpl(v));
            
          });
         
          /*
           * sticky search bar to top if scroll down over it
           */ 
          var $window = $(window);
          var $stickyBar = $('#stickyBar');
          var elTop = $stickyBar.offset().top;
          
          this.listenTo(this.eventBus, 'view:scrollToBtn', function() {
            if (!$stickyBar.is('.stickyBar')) {
              smoothScroll.animateScroll(null, '#btn-do-query', { offset : 50 } );
            }
          });
          
          $window.unbind('scroll').scroll(function() {
            
            if(!$stickyBar.is('.stickyBar')) {
              elTop = $stickyBar.offset().top;  
            }
            var sticky = $window.scrollTop() > Math.ceil(elTop) - 50;
            $stickyBar.toggleClass('stickyBar', sticky);
            $logList.toggleClass('stickyBarBuddy', sticky);
            
          });
          
        }
      
      });
   
});