var jswtPkg = new gara.Package({
	name : "jswt.events",
	exports : "FocusListener,SelectionListener,DisposeListener,KeyListener,MenuListener"
});
gara.jswt.namespace = jswtPkg.namespace;
gara.jswt.toString = function() {
	return "[gara.jswt.events]";
}

$package("");