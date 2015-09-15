#!/usr/bin/env node

// An example of generating a style from a node.js script.
// Since this is a fully-functional imperative language, we can use
// modules, constants, and the like.
var chroma = require('chroma-js');

var WATER_COLOR = '#ace';
var BACKGROUND = chroma(WATER_COLOR).darken().hex();

var style = {
  'version': 8,
  'name': 'Basic',
  'sources': {
    'mapbox': {
      'type': 'vector',
      'url': 'mapbox://mapbox.mapbox-streets-v6'
    },
    "grid": {
      "type": "vector",
      "url": "mapbox://devseed.7ws9izi8"
    }
  },
  'sprite': '',
  'glyphs': '',
  'layers': [{
    'id': 'background',
    'type': 'background',
    'paint': {
      'background-color': BACKGROUND
    }
  }, {
    'id': 'water',
    'type': 'fill',
    'source': 'mapbox',
    'source-layer': 'water',
    'paint': {
      'fill-color': WATER_COLOR
    }
  }, {
    "id": "states",
    "type": "line",
    "source": "mapbox",
    "source-layer": "admin",
    "paint": {
      "line-color": chroma(BACKGROUND).darken().hex()
    }
  }, {
    "id": "pop",
    "interactive": true,
    "type": "line",
    "source": "grid",
    "source-layer": "footprints",
    "paint": {
      "line-color": "#000"
    }
  }
  ]
};

var breaks = 16;
var maxVal = 100;

for (var i = 0; i < breaks; i++) {
  style.layers.push({
    "id": "pop" + i,
    "interactive": true,
    "type": "fill",
    "source": "grid",
    "source-layer": "footprints",
    "paint": {
      "fill-color": "#0ff",
      "fill-opacity": i / breaks
    },
    "filter": [ "all",
      [ ">", "FID", 1 ]
      //[ "<=", "FID", (i + 1) / breaks * maxVal ]
    ]
  })
}

process.stdout.write(JSON.stringify(style, null, 4));
