var garaPkg = new gara.Package({
	exports : "Package,EventManager,OutOfBoundsException",
	name : "gara"
});

gara.namespace = garaPkg.namespace;
gara.toString = function() {
	return "[gara]";
}

$package("");