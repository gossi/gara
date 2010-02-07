/*	$Id: MessageBox.class.js 180 2009-07-28 18:28:51Z tgossmann $

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

gara = {};

(function() {
base2.JavaScript.bind(window);

gara.config = {
	global : window,
	baseUrl : "./",
	disableIncludes : false
};

// Get script base path
var elements = document.getElementsByTagName("script");
for (var i = 0; i < elements.length; ++i) {
	if( elements[i].src && (elements[i].src.indexOf("gara.js") != -1) ) {
		gara.config.baseUrl = elements[i].src.substring(0, elements[i].src.lastIndexOf("/"));
		break;
	}
}

// Get document base path
//var documentBasePath = document.location.href;
//if (documentBasePath.indexOf('?') != -1) {
//	documentBasePath = documentBasePath.substring(0, documentBasePath.indexOf('?'));
//}
//var documentURL = documentBasePath;
//var documentBasePath = documentBasePath.substring(0, documentBasePath.lastIndexOf('/'));
//
//// If not HTTP absolute
//if (baseUrl.charAt(0) != '/') {
//	// If site absolute
//	baseUrl = documentBasePath + "/" + baseUrl;
//}

if (typeof(garaConfig) == "object") {
	var e;
	for (e in garaConfig) {
		gara.config[e] = garaConfig[e];
	}
}

// private members
var loadedUrls = [];
var loadedResources = [];
var packagePaths = {
	"gara.app" : "gara.app",
	"gara.jsface.action" : "gara.jsface.action",
	"gara.jsface.viewers" : "gara.jsface.viewers",
	"gara.jswt.widgets" : "gara.jswt.widgets",
	"gara.jswt.events" : "gara.jswt.events",
	"gara.jswt" : "gara.jswt",
	"gara" : "gara"
};



gara.XHR = function() {
	var XMLHTTP_PROGIDS = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];
	var xmlhttp = null;
	if (xmlhttp == null) {
		if (typeof XMLHttpRequest != "undefined") {
			xmlhttp = XMLHttpRequest;
		} else {
			for (var i = 0; i < 3; ++i) {
				var progid = XMLHTTP_PROGIDS[i];
				try {
					xmlhttp = ActiveXObject(progid);
				} catch (e) {}

				if (xmlhttp) {
					XMLHTTP_PROGIDS = [progid];
					break;
				}
			}
		}
	}
	return new xmlhttp();
};

gara.setPackagePath = function(pkg, path) {
	packagePaths[pkg] = path;
}

gara.loadScript = function(uri) {
	var xhr = gara.XHR();
	xhr.open('GET', uri, false);
	try {
		xhr.send(null);
		if (window.execScript) {
			window.execScript(xhr.responseText);
			return null;
		}
		return gara.config.global.eval ? gara.config.global.eval(xhr.responseText) : eval(xhr.responseText);
	} catch(e){
		console.error(e);
	}
}

gara.require = function(resource) {
	if (gara.config.disableIncludes) {
		return;
	}
	if (!loadedResources.contains(resource)) {
		// resolve path
		for (var pkg in packagePaths) {
			if (resource.match(pkg)) {
				var tail = resource.replace(pkg, "").replace(/\./g,"/");
				var path = gara.config.baseUrl + "/" + packagePaths[pkg] + tail + ".js";
				gara.loadScript(path);
				break;
			}
		}
	}
}

gara.provide = function(resource) {
	if (!loadedResources.contains(resource)) {
		loadedResources.push(resource);
	}
}

gara.loadScript(gara.config.baseUrl + "/class.js");

if (typeof(base2) == "undefined" && typeof(base2.DOM) == "undefined") {
	gara.loadScript(gara.config.baseUrl + "/base2-dom-fp.js");
}
})();