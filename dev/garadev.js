/*
 * Bring some _basic_ method into the native Array object if not already existent 
 */
if (!Array.prototype.contains) {
	Array.prototype.contains = function(search) {return base2.Array2.contains(this,search)};
}

if (!Array.prototype.forEach) {
	Array.prototype.forEach = function(block, context) {return base2.Array2.forEach(this, block, context)};
}

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(search, start) {return base2.Array2.indexOf(this,search, start)};
}

if (!Array.prototype.insertAt) {
	Array.prototype.insertAt = function(item, index) {return base2.Array2.insertAt(this, item, index)};
}

if (!Array.prototype.insertBefore) {
	Array.prototype.insertBefore = function(item, before) {return base2.Array2.insertBefore(this, item, before)};
}

if (!Array.prototype.lastIndexOf) {
	Array.prototype.lastIndexOf = function(item, fromIndex) {return base2.Array2.lastIndexOf(this, item, fromIndex)};
}

if (!Array.prototype.remove) {
	Array.prototype.remove = function(item) {return base2.Array2.remove(this, item)};
}

if (!Array.prototype.removeAt) {
	Array.prototype.removeAt = function(index) {return base2.Array2.removeAt(this, index)};
}

/* Finding script base path from tinymce.moxiecode.com */
var baseUrl;

// Get script base path
if (!baseUrl) {
	var elements = document.getElementsByTagName('script');

	for (var i = 0; i < elements.length; ++i) {
		if( elements[i].src && (elements[i].src.indexOf("garadev.js") != -1) ) {
			var src = elements[i].src;
			src = src.substring(0, src.lastIndexOf('/'));

			baseUrl = src;
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

// little version for simple script loading...
function loadScript(sScriptUrl) {
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('language', 'javascript');
	script.setAttribute('src', baseUrl + '/' + sScriptUrl);
	head.appendChild(script);
}

if (typeof(console) == "undefined") {
	loadScript('../lib/firebug/firebug.js');
}