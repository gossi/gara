
var garaConfig = {};

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

garaConfig = {
	disableIncludes : true,
	libPath : "../../lib"
//	baseUrl : "../../src"
}

//gd.loadScript("../../lib/base2-dom-fp.js");
//gd.loadScript("../../lib/class-debug.js");
injectScriptNode("../src/gara.js");

})();