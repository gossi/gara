/**
 * 
 */

var CompositeUITest = AsyncTestCase("CompositeUITest");

CompositeUITest.prototype.setUp = function () {
	document.body.className = "sand";
	gara.require("gara.widgets.Composite");
};

CompositeUITest.prototype.testHeight = function (q) {
	q.add(gara.ready(function() {
		var c = new gara.widgets.Composite(document.body).setHeight(350);
		assertEquals(350, jstestdriver.jQuery(c.handle).height());
	}));
	
//	q.defer(function (pool) {
//		pool.add(gara.ready(function() {
//			var c = new gara.widgets.Composite(document.createElement("div")).setHeight(350);
//			assertEquals(350, jstestdriver.jQuery(c.handle).height());
//		}));
//	});
};

//gara.require("gara.widgets.Composite", function () {
//	
//});