import React from 'react' // Needed for JSX to compile properly
import ReactDOM from 'react-dom'
import { json } from 'd3-request'
import { geoMercator, geoPath } from 'd3-geo'
import Choropleth from '../src/choropleth.js'
import * as TopoJson from 'topojson'

const projection = geoMercator()
const pathGenerator = geoPath(projection)

json('./countries.topo.json', (error, CountriesJson) => {
  const geoJson = TopoJson.feature(CountriesJson, CountriesJson.objects.countries)
  ReactDOM.render(
    <Choropleth width={500} height={500} geoJson={geoJson} pathGenerator={pathGenerator} />,
    document.getElementById('entry')
  )
})
