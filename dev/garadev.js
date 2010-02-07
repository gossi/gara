var gd = {};

(function() {
/* Finding script base path from tinymce.moxiecode.com */
var baseUrl, lastScript;

// Get script base path
if (!baseUrl) {
	var elements = document.getElementsByTagName('script');

	for (var i = 0; i < elements.length; ++i) {
		if( elements[i].src && (elements[i].src.indexOf("garadev.js") != -1) ) {
			var src = elements[i].src;
			baseUrl = src.substring(0, src.lastIndexOf('/'));
			lastScript = elements[i];
			break;
		}
	}
}

// Get document base path
var documentBasePath = document.location.href;
if (documentBasePath.indexOf('?') != -1) {
	documentBasePath = documentBasePath.substring(0, documentBasePath.indexOf('?'));
}
var documentURL = documentBasePath;
var documentBasePath = documentBasePath.substring(0, documentBasePath.lastIndexOf('/'));

// If not HTTP absolute
if (baseUrl.indexOf('://') == -1 && baseUrl.charAt(0) != '/') {
	// If site absolute
	baseUrl = documentBasePath + "/" + baseUrl;
}

function XHR() {
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
}

// little version for simple script loading...
gd.loadScript = function(uri) {
	var xhr = XHR();
	xhr.open('GET', uri, false);
	try {
		xhr.send(null);
		window.eval(xhr.responseText);
	} catch(e) {
		console.error(e);
	}
}

function injectScriptNode(uri) {
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('language', 'javascript');
	script.setAttribute('src', baseUrl + '/' + uri);
	if (head.lastChild == lastScript) {
		head.appendChild(script);
	} else {
		head.insertBefore(script, lastScript.nextSibling);
	}
	lastScript = script;
}

if (typeof(console) == "undefined") {
	//injectScriptNode('../lib/firebug/firebug.js');
}

var garaConfig = {
	disableIncludes : true,
	baseUrl : "../../src"
}

gd.loadScript("../../lib/base2-dom-fp.js");
//gd.loadScript("../../lib/class-debug.js");
gd.loadScript("../../src/gara.js");

})();