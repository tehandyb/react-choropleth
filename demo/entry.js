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
  { featureId: 'IRQ', value: 80 },
  { featureId: 'ALB', value: 200 },
  { featureId: 'MNG', value: 100 },
  { featureId: 'COL', value: 60 },
  { featureId: 'ARG', value: 150 }
]

const colors =  ["#a9c8f4", "#7fa1d2", "#5479b0", "#2a518e", "#002A6C"]
json('./countries.topo.json', (error, CountriesJson) => {
  const geoJson = TopoJson.feature(CountriesJson, CountriesJson.objects.countries)
  ReactDOM.render(
    <Choropleth 
      width={500} 
      height={500} 
      geoJson={geoJson}
      colors={colors}
      noDataColor="#bbb"
      data={countryValues}
    />,
    document.getElementById('entry')
  )
})
