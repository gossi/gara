/* Finding script base path from tinymce.moxiecode.com */
var baseUrl;

// Get script base path
if (!baseUrl) {
	var elements = document.getElementsByTagName('script');

	for (var i = 0; i < elements.length; ++i) {
		if( elements[i].src && (elements[i].src.indexOf("gaia.js") != -1) ) {
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

// for inheritance, from: http://phrogz.net/JS/Classes/OOPinJS2.html
Function.prototype.inheritsFrom = function(parentClassOrObject) { 
	if (parentClassOrObject.constructor == Function) { 
		//Normal Inheritance 
		this.prototype = new parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject.prototype;
	} else { 
		//Pure Virtual Inheritance 
		this.prototype = parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject;
	} 
	return this;
}