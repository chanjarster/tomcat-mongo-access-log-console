define([], function() {

  var K = 1024;
  var M = K * 1024;
  var G = M * 1024;
  var T = G * 1024;
  var P = T * 1024;
  return function(size) {
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

});