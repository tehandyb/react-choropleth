import React from 'react'
import PropTypes from 'prop-types'
import './defaultStyles.css'

function dataValueAccessor(featureId, data) {
  const datum = data.find(d => d.featureId === featureId)
  if(datum === undefined) return undefined
  return datum.value
}

function shapes(features, pathGenerator, colorGenerator, data, dataValueAccessor) {
  return features.map(feature => (
    <path key={feature.id} d={pathGenerator(feature)} fill={colorGenerator(dataValueAccessor(feature.id, data), data)} />
  ))
}

function transform(geoJson, width, height, pathGenerator) {
  const bounds = pathGenerator.bounds(geoJson)
  const dx = bounds[1][0] - bounds[0][0]
  const dy = bounds[1][1] - bounds[0][1]
  const x = (bounds[0][0] + bounds[1][0]) / 2
  const y = (bounds[0][1] + bounds[1][1]) / 2
  const scale = 0.9 / Math.max(dx / width, dy / height)
  const translate = [(width / 2) - (scale * x), (height / 2) - (scale * y)]

  return { scale, translate }
}

export default function Choropleth ({ width, height, data, geoJson, pathGenerator, colorGenerator, dataValueAccessor }) {
  const { translate, scale } = transform(geoJson, width, height, pathGenerator)
  return (
    <svg className="react-choropleth" width={width} height={height}>
      <g transform={`translate(${translate})scale(${scale})`}>
        {shapes(geoJson.features, pathGenerator, colorGenerator, data, dataValueAccessor)}
      </g>
    </svg>
  )
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
}

Choropleth.defaultProps = {
  dataValueAccessor: dataValueAccessor
}