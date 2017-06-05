(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('prop-types'), require('d3-scale'), require('d3-geo')) :
	typeof define === 'function' && define.amd ? define(['react', 'prop-types', 'd3-scale', 'd3-geo'], factory) :
	(global.ReactChoropleth = factory(global.React,global.PropTypes,global.d3Scale,global.d3Geo));
}(this, (function (React,PropTypes,d3Scale,d3Geo) { 'use strict';

function __$styleInject(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);
  return returnValue;
}

React = 'default' in React ? React['default'] : React;
PropTypes = 'default' in PropTypes ? PropTypes['default'] : PropTypes;

__$styleInject("svg.react-choropleth g path {\n      \n      stroke: grey;\n    }", undefined);

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

function dataValueAccessor(featureId, data) {
  var datum = data.find(function (d) {
    return d.featureId === featureId;
  });
  if (datum === undefined) return undefined;
  return datum.value;
}

function shapes(features, pathGenerator, colorScale, data, dataValueAccessor) {
  return features.map(function (feature) {
    return React.createElement('path', { key: feature.id, d: pathGenerator(feature), fill: colorScale(dataValueAccessor(feature.id, data), data) });
  });
}

function transform(geoJson, width, height, pathGenerator) {
  var bounds = pathGenerator.bounds(geoJson);
  var dx = bounds[1][0] - bounds[0][0];
  var dy = bounds[1][1] - bounds[0][1];
  var x = (bounds[0][0] + bounds[1][0]) / 2;
  var y = (bounds[0][1] + bounds[1][1]) / 2;
  var scale = 0.9 / Math.max(dx / width, dy / height);
  var translate = [width / 2 - scale * x, height / 2 - scale * y];

  return { scale: scale, translate: translate };
}

function colorScaleGenerator(colors, noDataColor) {
  var scale = d3Scale.scaleLinear().range(colors);

  return function (value, data) {
    if (value === undefined) return noDataColor;
    var values = data.map(function (d) {
      return d.value;
    });
    scale.domain([Math.min.apply(Math, toConsumableArray(values)), Math.max.apply(Math, toConsumableArray(values))]);
    return scale(value);
  };
}

function Choropleth(_ref) {
  var width = _ref.width,
      height = _ref.height,
      data = _ref.data,
      geoJson = _ref.geoJson,
      colors = _ref.colors,
      noDataColor = _ref.noDataColor,
      dataValueAccessor = _ref.dataValueAccessor;

  var projection = d3Geo.geoMercator();
  var pathGenerator = d3Geo.geoPath(projection);
  var colorScale = colorScaleGenerator(colors, noDataColor);

  var _transform = transform(geoJson, width, height, pathGenerator),
      translate = _transform.translate,
      scale = _transform.scale;

  return React.createElement(
    'svg',
    { className: 'react-choropleth', width: width, height: height },
    React.createElement(
      'g',
      { transform: 'translate(' + translate + ')scale(' + scale + ')' },
      shapes(geoJson.features, pathGenerator, colorScale, data, dataValueAccessor)
    )
  );
}

Choropleth.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.shape({
    featureId: PropTypes.string,
    value: PropTypes.number
  })),
  geoJson: PropTypes.shape({
    features: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string
    }))
  }),
  dataValueAccessor: PropTypes.func
};

Choropleth.defaultProps = {
  dataValueAccessor: dataValueAccessor
};

return Choropleth;

})));
//# sourceMappingURL=choropleth-dist.js.map
