// Date object that always reflects current time (with one second resolution)

'use strict';

var partial = require('es5-ext/lib/Function/prototype/partial')

  , update;

update = function () {
	this.setTime(Date.now());
};

module.exports = function () {
	var date = new Date();
	date.clear = partial.call(clearInterval,
		setInterval(update.bind(date), 1000));
	return date;
};
