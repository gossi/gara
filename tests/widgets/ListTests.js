var ListTests = AsyncTestCase('ListTests', ControlTests.prototype);

ListTests.prototype.testNamespace = function (queue) {
	queue.call('Setting up require', function (callbacks) {
		require(['gara/widgets/List'], callbacks.add(function (List) {
			assertEquals('gara.widgets.List === List', gara.widgets.List, List);
		}));
	});
}

ListTests.prototype.testCtor = function (queue) {
	queue.call('Simple Ctor', function (callbacks) {
		require(['gara/widgets/List'], callbacks.add(function (List) {
			var l = new gara.widgets.List(document.body, {});
			assertTrue(l.handle.classList.contains('garaList'));
			assertEquals(l.handle.getAttribute('role'), 'listbox');
			assertEquals(l.handle.getAttribute('aria-multiselectable'), 'false');
		}));
	});
	
	queue.call('Multi select', function (callbacks) {
		require(['gara/widgets/List'], callbacks.add(function (List) {
			var l = new gara.widgets.List(document.body, {multi: true});
			assertEquals(l.handle.getAttribute('aria-multiselectable'), 'true');
		}));
	});
}