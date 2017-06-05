import React from 'react' // Needed for JSX to compile properly
import ReactDOM from 'react-dom'
import { scaleLinear } from 'd3-scale'
import { json } from 'd3-request'
import { geoMercator, geoPath } from 'd3-geo'
import Choropleth from '../src/choropleth.js'
import * as TopoJson from 'topojson'

const projection = geoMercator()
const pathGenerator = geoPath(projection)
const countryValues = [
  { featureId: 'AFG', value: 20 },
  { featureId: 'PAK', value: 40 },
  { featureId: 'IRQ', value: 100 },
  { featureId: 'ALB', value: 400 },
  { featureId: 'MNG', value: 300 },
  { featureId: 'COL', value: 600 },
  { featureId: 'ARG', value: 1000 }
]
function colorGenerator(value, data) {
  const colors = [
    '#012E6E',
    '#1F5392',
    '#0166B6',
    '#A5C5EB',
    '#641C30',
    '#93606F'
  ]
  const noDataColor = '#bbb'
  if(value === undefined) return noDataColor
  const values = data.map(d => d.value)
  const scale = scaleLinear().domain([Math.min(...values), Math.max(...values)]).range(colors)
  return scale(value)
}

json('./countries.topo.json', (error, CountriesJson) => {
  const geoJson = TopoJson.feature(CountriesJson, CountriesJson.objects.countries)
  ReactDOM.render(
    <Choropleth 
      width={500} 
      height={500} 
      geoJson={geoJson}
      pathGenerator={pathGenerator} 
      colorGenerator={colorGenerator}
      data={countryValues}
    />,
    document.getElementById('entry')
  )
})
