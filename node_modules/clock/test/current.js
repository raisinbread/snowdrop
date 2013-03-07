'use strict';

module.exports = function (t, a, d) {
	var o = t(), now = Date.now();
	a.ok(o.getTime() < (now + 500), "Initial: Accuracy #1");
	a.ok(o.getTime() > (now - 500), "Initial: Accuracy #2");

	setTimeout(function () {
		now = Date.now();
		a.ok(o.getTime() < (now + 500), "Delay: Accuracy #1");
		a.ok(o.getTime() > (now - 500), "Delay: Accuracy #2");
		o.clear();
		d();
	}, 1000);
};
