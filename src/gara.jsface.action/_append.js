var pkg = new gara.Package({
	name : "jsface.action",
	exports : ""
});
gara.jsface.namespace = pkg.namespace;
gara.jsface.toString = function() {
	return "[gara.jsface]";
}

$package("");