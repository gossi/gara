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

// little version for simple script loading...
function loadScript(sScriptUrl) {
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('language', 'javascript');
	script.setAttribute('src', baseUrl + '/' + sScriptUrl);
	head.appendChild(script);
}

// load lib
loadScript('lib/functions.js');
loadScript('lib/class.array.js');
loadScript('lib/class.string.js');

// load Exceptions
loadScript('class.Exception.js');
loadScript('class.WrongObjectException.js');
loadScript('class.OutOfBoundsException.js');
loadScript('class.DefectInterfaceImplementationException.js');

// load utils
loadScript('util/class.AbstractList.js');
loadScript('util/class.Queue.js');
loadScript('util/class.Stack.js');

// load Logging Stuff
loadScript('class.ExceptionHandler.js');
loadScript('class.InterfaceTester.js');
loadScript('class.LogNode.js');
loadScript('class.LogFolderNode.js');
loadScript('class.LogMessageNode.js');
loadScript('class.LogWarningNode.js');
loadScript('class.LogErrorNode.js');
loadScript('class.Log.js');
loadScript('class.LogWriter.js');
loadScript('class.Console.js');
loadScript('class.Firebug.js');

// load jsRIA 'core'
loadScript('class.ScriptLoader.js');
loadScript('class.EventListener.js');
loadScript('class.EventManager.js');
loadScript('class.Gaia_dev.js');
loadScript('gaia.js');
