if (typeof(console) != "undefined") {
	gaia.getLog().addWriter(new Firebug());
}