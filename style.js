var chroma = require('chroma-js')
var mapboxLight = require('./mapbox-light.json')

var GRID_FILL = '#439ab4'
var GRID_FILL_MAX_OPACITY = 0.6
var GRID_STROKE = '#1f3b45'

mapboxLight.layers.forEach(function (layer) {
  layer.interactive = false
})

/**
 * Generates a style sheet with a simple base layer, and a color-scaled grid
 * with `breaks` levels.  Grid boxes are colored according to the value of
 * `property`, which is expected to range between 0 and `maxVal`.
 */
module.exports = function (property, breaks, maxVal) {
  var style = {
    'version': 8,
    'name': 'Basic',
    'sources': {
      'mapbox': {
        'type': 'vector',
        'url': 'mapbox://mapbox.mapbox-streets-v6'
      },
      'mapbox://mapbox.mapbox-terrain-v2': {
        'url': 'mapbox://mapbox.mapbox-terrain-v2',
        'type': 'vector'
      },
      'grid': {
        'type': 'vector',
        'url': 'mapbox://devseed.oam-footprints'
      },
      'grid-hover': {
        'type': 'geojson',
        'data': { 'type': 'FeatureCollection', 'features': [] }
      }
    },
    'sprite': 'mapbox://sprites/devseed/cife4hfep6f88smlxfhgdmdkk',
    'glyphs': 'mapbox://fonts/devseed/{fontstack}/{range}.pbf',
    'layers': mapboxLight.layers.concat([{
      'id': 'footprint-grid',
      'interactive': true,
      'type': 'line',
      'source': 'grid',
      'source-layer': 'footprints',
      'paint': {
        'line-color': GRID_STROKE,
        'line-opacity': 0.1
      }
    }])
  }

  // Dynamically generate a set of layers that mimic data-driven styling.
  // This set of layers is like a color scale: it selects features with the
  // appropriate data values with `filter`, and then styles them with the
  // approprieate `fill-opacity`.
  for (var i = 0; i < breaks; i++) {
    style.layers.push({
      'id': 'footprint-grid-' + i,
      'interactive': true,
      'type': 'fill',
      'source': 'grid',
      'source-layer': 'footprints',
      'paint': {
        'fill-color': GRID_FILL,
        'fill-opacity': GRID_FILL_MAX_OPACITY * i / breaks
      },
      'filter': [ 'all',
        [ '>', property, i / breaks * maxVal ],
        [ '<=', property, (i + 1) / breaks * maxVal ]
      ]
    })
  }

  // add the hover style layer at the end so it goes on top
  style.layers.push({
    id: 'hover-style',
    type: 'fill',
    source: 'grid-hover',
    paint: {
      'fill-color': '#a3d'
    }
  })

  return style
}
