# Clock - Indicate and co-ordinate JavaScript time events

_Idea of this package is deprecated. It's best to not rely on it, development is closed._

Simple functions that helps to deal with time events.  
Can be used in Node.js and browser environments

## Installation

Node & npm:

	$ npm install clock

## Usage

Require what you need individually:

	var interval = require('clock/lib/interval')
	  , nextTick = require('clock/lib/next-tick')

	interval(...)
	nextTick(...)

or grab it all:

	var clock = require('clock');

	clock.inteval(...)
	clock.nextTick(...)

### Available tools

_Each extension is documented at begin of its source file._

* `interval`
* `nextTick`

## Tests [![Build Status](https://secure.travis-ci.org/medikoo/clock.png?branch=master)](https://secure.travis-ci.org/medikoo/clock)

	$ npm test
