/**
 * @class gara.Namespace - Namespace definition for the different gara packages
 */
$class("Namespace", {
	imports : "",
	exports : "",
	namespace : "",
	name : "",

	$constructor : function(_data) {
		this.name = _data.name || "gara";
		this.imports = _data.imports || "";
		this.exports = _data.exports || "";
		
		if (this.name != "gara") {
			this.name = "gara." + this.name;
		}
		
		var imports = ("gara," + this.imports).split(",");
		this.imports = "";
		imports.forEach(function(v, k, arr) {
			if (gara[v]) {
				this.imports += gara[v].namespace;
			}
		}, this);
		
		var exports = this.exports.split(",");
		this.exports = "";
		exports.forEach(function(v, k, arr) {
			this.exports += this.name + "." + v + "=" + v + ";";
			this.namespace += "var " + v + "=" + this.name + "." + v + ";";
		}, this);
	}
});

var garaPkg = new Namespace({
	exports : "Namespace",
	name : "gara"
});