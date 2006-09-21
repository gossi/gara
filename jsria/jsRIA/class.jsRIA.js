function jsRIA(sInstanceName) {
	this.xmlDoc;
	this.baseUrl;
	this.sInstance = sInstanceName;
	this.bDependsDocLoaded = false;
	this.sMainScriptUrl;
	this.bUseBaseUrl = false;
	this.eventManager;

//	alert(xmlDoc.getElementsByTagName('class').length);
//	document.writeln(xmlDoc);

	this.interfaceTester = new InterfaceTester(this);
	this.console = new Console(this);
	this.log = new Log(this);
	this.exceptionHandler = new ExceptionHandler(this);
	this.exceptionHandler.setLog(this.log);
	this.log.addWriter(this.console);
	this.exceptionHandler.setErrorReporting(this.exceptionHandler.ER_LOG);
}

jsRIA.prototype.setBaseUrl = function(sBaseUrl) {
	this.baseUrl = sBaseUrl;	
}

jsRIA.prototype.getBaseUrl = function() {
	return this.baseUrl;
}

jsRIA.prototype.setScriptLoader = function(Loader) {
	this.scriptLoader = Loader;	
}

jsRIA.prototype.getScriptLoader = function() {
	return this.scriptLoader;
}

jsRIA.prototype.getExceptionHandler = function() {
	return this.exceptionHandler;	
}

jsRIA.prototype.getInterfaceTester = function() {
	return this.interfaceTester;
}

jsRIA.prototype.setEventManager = function(em) {
	this.eventManager = em;
}

jsRIA.prototype.getEventManager = function() {
	return this.eventManager;
}

jsRIA.prototype.getLog = function() {
	return this.log;
}

jsRIA.prototype.getConsole = function() {
	return this.console;
}

jsRIA.prototype.loadDependsDoc = function() {
	xmlDoc = this.importXML(this.baseUrl + '/dependencies.xml', 
		jsRIA.callDependsLoadHandler);
}

jsRIA.prototype.isDependsDocLoaded = function() {
	return this.bDependsDocLoaded;
}

jsRIA.prototype.setMainScriptUrl = function(sScriptUrl, bUseBaseUrl) {
	this.sMainScriptUrl = sScriptUrl;
	
	if (typeof(bUseBaseUrl) == "undefined")	{
		this.bUseBaseUrl = false;
	}
}

/**
 */
jsRIA.prototype.importXML = function(sXMLFile, callBackFunction) {

	var xmlDoc;

	if (document.implementation && document.implementation.createDocument) {
		xmlDoc = document.implementation.createDocument("", "", null);
		xmlDoc.onload = function() {
			callBackFunction(xmlDoc);
		}
	} else if (window.ActiveXObject) {
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.onreadystatechange = function () {
			if (xmlDoc.readyState == 4) {
				callBackFunction(xmlDoc);
			}
		};
 	} else {
		alert('Your browser can\'t handle this script');
		return;
	}
	return xmlDoc.load(sXMLFile);
}

jsRIA.prototype.callDependsLoadHandler = function(XmlDoc) {
	jsRIA.getScriptLoader().setDependsDoc(XmlDoc);
	jsRIA.bDependsDocLoaded = true;
	jsRIA.getScriptLoader().loadScript(jsRIA.sMainScriptUrl, jsRIA.bUseBaseUrl);
}

jsRIA.prototype.addEvent = function(obj, type, fn) {
//	alert(type + " " + typeof(fn));
//	alert(obj);
	if (obj.addEventListener) {
		try {
			obj.addEventListener(type, fn, false);
		} catch(e) {}
		return true;
	} else if (obj.attachEvent) { 
		var r = obj.attachEvent("on" + type, fn);
		return r;
	}
	return false;
}