import React from 'react' // Needed for JSX to compile properly
import ReactDOM from 'react-dom'
import Choropleth from '../src/choropleth.js'

ReactDOM.render(
    <Choropleth />,
    document.getElementById('entry')
)