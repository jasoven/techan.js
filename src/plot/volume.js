'use strict';

module.exports = function(accessor_volume, plot, plotMixin) {  // Injected dependencies
  return function() { // Closure function
    var p = {},  // Container for private, direct access mixed in variables
        volumeGenerator;

    function volume(g) {
      var group = plot.groupSelect(g, plot.dataMapper.array, p.accessor.d);

      if(p.accessor.o && p.accessor.c) plot.appendPathsUpDownEqual(group.selection, p.accessor, 'volume');
      else group.entry.append('path').attr('class', 'volume');

      volume.refresh(g);
    }

    volume.refresh = function(g) {
      g.selectAll('path.volume').attr('d', volumeGenerator);
    };

    function binder() {
      volumeGenerator = plot.joinPath(volumePath);
    }

    function volumePath() {
      var accessor = p.accessor,
          x = p.xScale,
          y = p.yScale,
          width = p.width(x);

      return function(d) {
        var vol = accessor.v(d);

        if(isNaN(vol)) return null;

        var zero = y(0),
          height = y(vol) - zero,
          xValue = x(accessor.d(d)) - width/2;

        return 'M ' + xValue + ' ' + zero + ' l 0 ' + height + ' l ' + width +
          ' 0 l 0 ' + (-height);
      };
    }

    // Mixin 'superclass' methods and variables
    plotMixin(volume, p).plot(accessor_volume(), binder).width(binder);

    return volume;
  };
};