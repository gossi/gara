var jswtPkg = new gara.Package({
	name : "jswt",
	exports : "JSWT,JSWTException"
});
gara.jswt.namespace = jswtPkg.namespace;
gara.jswt.toString = function() {
	return "[gara.jswt]";
}

$package("");