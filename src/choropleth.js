import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import * as d3Scale from 'd3-scale'
import * as d3Geo from 'd3-geo'
import ss from 'simple-statistics'
import ReactTooltip from 'react-tooltip'
import './defaultStyles.css'

function tooltipContent(tooltipData) {
  if(tooltipData === undefined) return <span>N/A</span>
  return <span>Tooltip content {tooltipData.value}</span>
}

function dataValueAccessor(featureId, data) {
  const datum = datumAccessor(featureId, data)
  if(datum === undefined) return undefined
  return datum.value
}

function datumAccessor(featureId, data) {
  return data.find(d => d.featureId === featureId)
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

function colorScaleGenerator(colors, noDataColor, colorScaleType, data) {
  const scale = d3Scale[colorScaleType]().range(colors)
  const values = data.map(d => d.value)
  if (colorScaleType === 'scaleQuantize') {
    scale.domain([Math.min(...values), Math.max(...values)])
  } else if (colorScaleType === 'scaleThreshold') {
    scale.domain(ss.ckmeans(values, colors.length - 1).map((cluster) => cluster[0]))
  }

  return function(value) {
    if(value === undefined) return noDataColor
    return scale(value)
  }
}
function  shapes(features, pathGenerator, colorScale, data, dataValueAccessor, onMouseOver) {
    return features.map(feature => {
      const pathKey = `${feature.id}-pathkey`
      return (
        <path 
          data-tip 
          data-for={'global-tooltip'} 
          key={pathKey} 
          d={pathGenerator(feature)} 
          fill={colorScale(dataValueAccessor(feature.id, data), data)} 
          onMouseOver={() => onMouseOver(datumAccessor(feature.id, data))}
        />
      )
    })
  }

function Choropleth ({ width, height, data, geoJson, colors, noDataColor, dataValueAccessor, projectionName, colorScaleType, tooltipContent, onMouseOver }) {
  const projection = d3Geo[projectionName]()
  const pathGenerator = d3Geo.geoPath(projection)
  const colorScale = colorScaleGenerator(colors, noDataColor, colorScaleType, data)
  const { translate, scale } = transform(geoJson, width, height, pathGenerator)
  return (
    <svg className="react-choropleth" width={width} height={height}>
      <g transform={`translate(${translate})scale(${scale})`}>
        {shapes(geoJson.features, pathGenerator, colorScale, data, dataValueAccessor, onMouseOver)}
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
  dataValueAccessor: PropTypes.func,
  projectionName: PropTypes.string,
  // Only supporting the scales that are good for intensity maps(scaleQuantize for a basic distribution and scaleThreshold for a clustered distribution)
  colorScaleType: PropTypes.oneOf(['scaleQuantize', 'scaleThreshold']),
  tooltipContent: PropTypes.func
}

Choropleth.defaultProps = {
  dataValueAccessor: dataValueAccessor,
  projectionName: 'geoMercator', // Can be any d3Geo projections
  colorScaleType: 'scaleQuantize',
  tooltipContent: tooltipContent
}

class ImmutableWrapper extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.immutableProps !== nextProps.immutableProps
  }

  render() {
    return <div>{React.cloneElement(this.props.children, this.props.immutableProps.toJS() )}</div>
  }
}

export default class ChoroplethWithTooltip extends Component{
  constructor(props) {
    super(props)
    this.state = {
      tooltipData: undefined,
      immutableProps: fromJS(props)
    }
  }

  componentWillReceiveProps(nextProps) {
    const nextImmutableProps = fromJS(props)
    if(!this.state.immutableProps.equals(nextImmutableProps)) {
      this.setState({ immutableProps: nextImmutableProps })
    }
  }

  render() {
    return (
      <div>
        <ImmutableWrapper immutableProps={this.state.immutableProps}>
          <Choropleth onMouseOver={(data) => this.setState({ tooltipData: data })}/>
        </ImmutableWrapper>
        <ReactTooltip id="global-tooltip">{tooltipContent(this.state.tooltipData)}</ReactTooltip>
      </div>
    )
  }
}

ChoroplethWithTooltip.propTypes = Choropleth.propTypes
ChoroplethWithTooltip.defaultProps = Choropleth.defaultProps
