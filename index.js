var React = require('react')
var mapboxgl = require('mapbox-gl')
var validate = require('mapbox-gl-style-spec').validate
var filters = require('oam-browser-filters').getAllCombinations()
var Filters = require('./filters')
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
    center: [Math.random() * 180, 0],
    zoom: 1
  })

  function updateFilter (filter) {
    console.log(filter)
    stylesheet = makeStyle(filter.key + '_count', 16, 100)
    if (validateStyle(stylesheet)) {
      map.setStyle(stylesheet)
    }
  }

  // chose the filter
  React.render(<Filters onChange={updateFilter} />, document.getElementById('choose'))

  // Track mouse movements, use it to look up the feature properties from the
  // vector tiles underneath the mouse
  var follow = true
  map.on('mousemove', function (e) {
    if (!follow) return
    map.featuresAt(e.point, { includeGeometry: true }, function (err, features) {
      if (err) throw err
      map.getSource('grid-hover').setData(fc(features))
      features.forEach(function (f) {
        f.layerid = f.layer.id
        delete f.layer
      })
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

