var garaPkg = new gara.Package({
	exports : "Package,EventManager,Utils,I18n,OutOfBoundsException",
	name : "gara"
});

gara.version = "1.5-beta1";
gara.namespace = garaPkg.namespace;
gara.toString = function() {
	return "[gara]";
}

$package("");