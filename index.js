var React = require('react')
var mapboxgl = require('mapbox-gl')
var validate = require('mapbox-gl-style-spec').validate
var filters = require('oam-browser-filters').getAllCombinations()
var makeStyle = require('./style')

mapboxgl.accessToken = 'pk.eyJ1IjoiZGV2c2VlZCIsImEiOiJnUi1mbkVvIn0.018aLhX0Mb0tdtaT2QNe2Q'
var errors = document.getElementById('errors')

document.addEventListener('DOMContentLoaded', function () {
  // Initialize the map
  var stylesheet = makeStyle(filters[0].key + '_count', 16, 100)
  if (!validateStyle(stylesheet)) { return }
  var map = new mapboxgl.Map({
    container: 'map',
    style: stylesheet,
    center: [-74.50, 40],
    zoom: 9
  })

  var hoverSource
  function setupHover () {
    hoverSource = new mapboxgl.GeoJSONSource({ data: fc([]) })
    // add an empty source for storing the hovered feature
    map.addSource('hover', hoverSource)
    map.addLayer({
      id: 'hover-style',
      type: 'fill',
      source: 'hover',
      paint: {
        'fill-color': '#a3d'
      }
    })
  }

  // chose the filter
  var ChooseFilter = React.createClass({
    onChange: function (e) {
      stylesheet = makeStyle(e.target.value + '_count', 16, 100)
      if (validateStyle(stylesheet)) {
        map.setStyle(stylesheet)
        map.on('style.load', setupHover)
      }
    },

    render: function () {
      return (
        <select onChange={this.onChange}>
          {filters.map(f => (
            <option value={f.key} key={f.key}>{f.key}</option>
          ))}
        </select>
      )
    }
  })
  React.render(<ChooseFilter />, document.getElementById('choose'))

  // initialize the hover on initial map load
  map.on('load', setupHover)

  // Track mouse movements, use it to look up the feature properties from the
  // vector tiles underneath the mouse
  var follow = true
  map.on('mousemove', function (e) {
    if (!follow) return
    map.featuresAt(e.point, { includeGeometry: true }, function (err, features) {
      if (err) throw err
      hoverSource.setData(fc(features))
      features.forEach(function (f) {
        f.layerid = f.layer.id
        delete f.layer
      })
      document.querySelector('#features').innerHTML = '<pre>' +
        JSON.stringify(features, null, 2) + '</pre>'
    })
  })

  map.on('click', function () {
    follow = !follow
    document.querySelector('#features').classList.toggle('follow')
  })
})

function fc (features) {
  return {
    type: 'FeatureCollection',
    features: features
  }
}

function validateStyle (stylesheet) {
  // validate the stylesheet (useful for development purposes)
  var valid = validate(JSON.stringify(stylesheet))
  if (valid.length) {
    errors.style.display = 'block'
    errors.appendChild(document.createElement('h2')).innerHTML = 'Style Validation Error'
    valid.forEach(function (e) {
      errors.appendChild(document.createElement('p')).innerHTML = e.message
      console.error(e)
    })
    return false
  }
  return true
}

