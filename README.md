# [Mapbox GL](https://www.mapbox.com/mapbox-gl/) Code Flow Example

This repository is a simple example of a development environment for Mapbox GL
styles that is based on editing raw code with a text editor. This style
of editing is similar to [TileMill](https://www.mapbox.com/tilemill/)
or the [Mapbox Studio](https://www.mapbox.com/mapbox-studio/) desktop
tools.

This example is based on [Gulp](http://gulpjs.com/) as a framework for its
basic utilities:

* A [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/)-powered page for
  previewing the style
* Support for [JSON](http://json.org/), [JSON5](http://json5.org/),
  [YAML](http://yaml.org/), and [TOML](https://github.com/toml-lang/toml)
  files as input. You can also specify an executable JavaScript file with a `.js` extension
  and hashbang and the file will be run and its output piped into the style
  definition.
* Live-reloading when the style is changed

## Install

First, clone this git repository:

    git clone https://github.com/mapbox/mapbox-gl-codeflow-example.git
    cd mapbox-gl-codeflow-example

And then install the dependencies:

    npm install

And then start up:

    gulp --style=style.js

