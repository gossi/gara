/*	$Id $

		gara - Javascript Toolkit
	===========================================================================

		Copyright (c) 2007 Thomas Gossmann
	
		Homepage:
			http://gara.creative2.net

		This library is free software;  you  can  redistribute  it  and/or
		modify  it  under  the  terms  of  the   GNU Lesser General Public
		License  as  published  by  the  Free Software Foundation;  either
		version 2.1 of the License, or (at your option) any later version.

		This library is distributed in  the hope  that it  will be useful,
		but WITHOUT ANY WARRANTY; without  even  the  implied  warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See  the  GNU
		Lesser General Public License for more details.

	===========================================================================
*/

/**
 * @class Package
 * @author Thomas Gossmann
 * @namespace gara
 */
$class("Package", {
	exports : "",
	namespace : "",
	name : "",
	version : "",

	$constructor : function(_data) {
		this.name = _data.name || "gara";
		this.imports = _data.imports || "";
		this.exports = _data.exports || "";
		
		if (this.name != "gara") {
			gara.namespace += "var " + this.name + "=gara." + this.name;
			this.name = "gara." + this.name;
		}
		
		var exports = this.exports.split(",");
		exports.forEach(function(v, k, arr) {
			this.namespace += "var " + v + "=" + this.name + "." + v + ";";
		}, this);
	}
});