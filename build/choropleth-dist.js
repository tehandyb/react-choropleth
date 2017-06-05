(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react')) :
	typeof define === 'function' && define.amd ? define(['react'], factory) :
	(global.ReactChoropleth = factory(global.React));
}(this, (function (React) { 'use strict';

React = 'default' in React ? React['default'] : React;

var choropleth = function () {
  return React.createElement(
    'div',
    null,
    'choropleth from src '
  );
};

return choropleth;

})));
//# sourceMappingURL=choropleth-dist.js.map
