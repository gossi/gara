function ScriptLoader() {
	this.log;
	this.baseUrl;
	this.dependsDoc;
	this.aDependencies = new Object();
	this.aLoadedScripts = new Array();
	this.Queue = new Queue();
}


ScriptLoader.prototype.setBaseUrl = function(sBaseUrl) {
	this.baseUrl = sBaseUrl;
}

ScriptLoader.prototype.setLog = function(log) {
	this.log = log;
}

ScriptLoader.prototype.setDependsDoc = function(xmlDoc) {
	this.dependsDoc = xmlDoc;
	this.log.addMessage("Dependency information loaded. Loading enqueded scripts.");
	this.loadQueue();
}

ScriptLoader.prototype.loadQueue = function() {
	while (!this.Queue.empty()) {
		this.loadScript(this.Queue.pop());
	}
}

ScriptLoader.prototype.enqueueScript = function(sScriptUrl) {
	this.Queue.push(sScriptUrl);
}

/**
 * Loads a Script
 * @param sScriptUrl the script to be loaded
 */
ScriptLoader.prototype.loadScript = function(sScriptUrl, bUsebaseUrl) {

	if (typeof(bUsebaseUrl) == "undefined") {
		bUsebaseUrl = true;
	}

	// check if script already loaded
	for (var i = 0; i < this.aLoadedScripts.length; ++i) {
		if (this.aLoadedScripts[i] == sScriptUrl) {
			this.log.addMessage("[ScriptLoader] Try loading Script (" + sScriptUrl + "). Script already loaded.");
			return;
		}
	}

	// enqueue script if dependency information are not available yet	
	if (typeof(this.dependsDoc) == "undefined") {
		this.enqueueScript(sScriptUrl);
		this.log.addMessage("[ScriptLoader] Try loading Script (" + sScriptUrl + "). Dependency information not available yet. Enqueue Script.");
		return;
	}

	// load needed classes defined in dependencies.xml
	var Elem;
	if (Elem = this.dependsDoc.getElementById(sScriptUrl)) {
		this.log.pushLogFolder(this.log.createFolder('[ScriptLoader] Loading needed scrips for: ' + sScriptUrl));

		// from attribute
		var sDepends = Elem.getAttribute('depends');		
		if (sDepends != null) {
			this.loadScript(sDepends);
		}

		// from ChildNodes
		var DependsNodeList = Elem.getElementsByTagName('depends');
		if (DependsNodeList != null) {
			for (var i = 0; i < DependsNodeList.length; ++i) {
				var DependsNode = DependsNodeList.item(i);
				this.loadScript(DependsNode.textContent);
			}
		}

		this.log.popLogFolder();
	}

	// finally load the script
	var srcUrl = sScriptUrl;
	if (bUsebaseUrl) {
		srcUrl = this.baseUrl + '/' + sScriptUrl;
	}
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('language', 'javascript');
	script.setAttribute('src', srcUrl);
	head.appendChild(script);
	
	this.aLoadedScripts.push(sScriptUrl);
	this.log.addMessage("[ScriptLoader] Loaded Script (" + sScriptUrl + ").");

	return;
}