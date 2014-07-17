define([], function(){
  
  // TODO use sockiet.io refresh stats in realtime
  var humanReadable = function(size) {

    var K = 1024;
    var M = K * 1024;
    var G = M * 1024;
    var T = G * 1024;
    var P = T * 1024;
    
    if (size < K) {
      return size + 'B';
    }
    if (size < M) {
      return (size / K) + 'K';
    }
    if (size < G) {
      return (size / M) + 'M';
    }
    if (size < T) {
      return (size / G) + 'G';
    }
    if (size < P) {
      return (size / T) + 'T';
    }
    return (size / P) + 'P';

  };
  
  return Backbone.View.extend({
    
    infoTmpl : _.template("count:<%= count %>, size:<%= size %>, storageSize:<%= storageSize %>"),
    
    initialize : function(options) {
      this.eventBus = options.eventBus;
      this.stats = {
          count : 0,
          size : 0,
          storageSize : 0
      };
      this.listenTo(this.eventBus, 'update:collection-info', function(s) {
        this.stats = s;
        this.render();
      }, this);
    },
    
    render : function() {
      var v = {};
      v.count = this.stats.count;
      v.size = humanReadable(this.stats.size);
      if (!this.stats.storageSize) {
        v.storageSize = 'unlimited';
      } else {
        v.storageSize = humanReadable(this.stats.storageSize);
      }
      this.$el.html(this.infoTmpl(v));
    }
    
  });
  
});