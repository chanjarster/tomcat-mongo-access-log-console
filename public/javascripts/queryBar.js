/*
 * Pagination area view
 */
define([], function(humanReadableSize) {
  
  return Backbone.View.extend({
    
    events : {
      'click .pagination a'   : 'jump',
      'click #btn-do-query'   : 'collectParams',
      'click #btn-top-10-url' : 'openTop10url',
      'click #btn-request-stats' : 'openRequestStats'
    },
    
    initialize : function(options) {
      
      this.eventBus = options.eventBus;
      this.$stickyBuddy = options.$stickyBuddy;
      this.$pagination = this.$el.find('.pagination');
      this.info = {
          params : {},
          pageNo : 1,
          limit : 20,
          count : 0
      };

      this.sticky();
      
      this.listenTo(this.eventBus, 'query:do', function(queryOption) {
        
        this.info.params = queryOption.params || this.info.params;
        this.info.pageNo = queryOption.pageNo || this.info.pageNo;
        this.info.limit = queryOption.limit || this.info.limit;
        
        this.query();
        
      }, this);
      
    },
    
    sticky : function() {
      /**
       * make query bar sticky when scroll to top
       */
      var $window = $(window);
      var $el = this.$el;
      var $stickyBuddy = this.$stickyBuddy;
      var elTop = $el.offset().top;
      
      this.listenTo(this.eventBus, 'view:scrollToBtn', function() {
        if (!$el.is('.stickyBar')) {
          smoothScroll.animateScroll(null, '#btn-do-query', { offset : 50 } );
        }
      });
      
      $window.unbind('scroll').scroll(function() {
        
        if(!$el.is('.stickyBar')) {
          elTop = $el.offset().top;  
        }
        var sticky = $window.scrollTop() > Math.ceil(elTop) - 50;
        $el.toggleClass('stickyBar', sticky);
        $stickyBuddy.toggleClass('stickyBarBuddy', sticky);
        
      });
    },
    
    collectParams : function() {
      this.eventBus.trigger("query:collect-params", "query:do");
    },
    
    query : function() {
      
      var that = this;
      var info = this.info;
      
      $.get('/logs', {
        
         query : JSON.stringify(info.params),
        pageNo : info.pageNo,
         limit : info.limit
        
      }, function(result) {
        
        that.eventBus.trigger('log:refereshList', result.logs);
        
        info.pageNo = result.pageNo;
        info.limit = result.limit;
        info.count = result.count;
        info.stats = result.stats;
        
        that.render();
        
      }, 'json');
      
    },
    
    jump : function(event) {
      
      var $a = $(event.target);
      
      if ($a.parent('li').is('.disabled')) {
        event.preventDefault();
        return;
      }
      var pageNo = $a.html();
      
      if ($a.is('.pg-prev')) {
        this.info.pageNo--;
      } else if ($a.is('.pg-next')) {
        this.info.pageNo++;
      } else {
        this.info.pageNo = parseInt(pageNo);
      }
      
      this.query();
      event.preventDefault();
    },
    
    openTop10url : function() {
      this.eventBus.trigger('top10url:open');
    },
    
    openRequestStats : function () {
      this.eventBus.trigger('requestStats:open');
    },
    
    render : function() {
      
      var pageNo = this.info.pageNo,
          limit = this.info.limit,
          count = this.info.count,
          maxPageCount = Math.ceil(count / limit)
      ;

      
      this.$pagination.empty();
      
      if ( count == 0) {
        return;
      }
      
      // <<
      if (pageNo == 1) {
        this.$pagination.append('<li class="disabled"><a href="#" class="pg-prev">&laquo;</a></li>');
      } else {
        this.$pagination.append('<li><a href="#" class="pg-prev">&laquo;</a></li>');
      }
      
      // left-4, pageNo, right-4
      var s = pageNo - 3;
      s = s < 1 ? 1 : s;
      var e = pageNo + 4;
      e = e > maxPageCount ? maxPageCount : e;
      if (e - s < 8) {
        e = s + (8 - 1);
        e = e > maxPageCount ? maxPageCount : e;
        if ( e - s < 8) {
          s = e - (8 - 1);
          s = s < 1 ? 1 : s;
        }
      }
      
      for (var i = s; i <= e; i++) {
        if (i == pageNo) {
          this.$pagination.append('<li class="active"><a href="#">' + i +  '</a>');
        } else {
          this.$pagination.append('<li><a href="#">' + i +  '</a>');
        }
      }
      
      // >>
      if (pageNo == maxPageCount) {
        this.$pagination.append('<li class="disabled"><a href="#" class="pg-next">&raquo;</a></li>');
      } else {
        this.$pagination.append('<li><a href="#" class="pg-next">&raquo;</a></li>');
      }
      
      this.eventBus.trigger('update:collection-info', this.info.stats);
    }
    
  });
  
});