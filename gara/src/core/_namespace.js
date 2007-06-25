/** @overview gara toolkit */


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
		
		var imports = "gara," + this.imports.split(",");
		this.imports = "";
		forEach(imports, function(v, k, imports) {
			if (gara[v]) {
				this.imports += gara[v].namespace;
			}
		}, this);
		
		var exports = this.exports.split(",");
		this.exports = "";
		forEach(exports, function(v, k, exports) {
			this.exports += this.name + "." + v + "=" + v + ";";
			this.namespace += "var " + v + "=" + this.name + "." + v + ";";
		}, this);
	}
});

var garaPkg = new Namespace({
	exports : "onDOMLoaded,Namespace",
	name : "gara"
});