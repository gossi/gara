function ParamSet() {
	this.aParams = new Array();	
}

ParamSet.prototype.addParam = function(p) {
	this.aParams.push(p);
}

ParamSet.prototype.getParams = function() {
	return this.aParams;
}

function EventManager(sInstance) {
	this.sInstance = sInstance;
	this.aEvents = new Array();		
}

EventManager.prototype.registerEvent = function(element, event, obj, method, params) {
	if (typeof(params) == "undefined") {
		params = null;
	}

	this.aEvents.push({
		"obj" : obj,
		"method" : method,
		"params" : params,
	});
	var iId = this.aEvents.length - 1;
	
	try {
		//eval("fn = "+this.sInstance+".fire");
		jsRIA.addEvent(element, event, obj);
		//jsRIA.addEvent(element, event, this);
	} catch(e) {
		alert("Exception:" + e);
	}
	return iId;
}

EventManager.prototype.fire = function(iId) {
	return alert("fire <" + iId + ">");
	if (iId >= this.aEvents.length) {
		throw new OutOfBoundsException("Event not registered (" + iId + ")", "EventManager", "fire");
	}

	var info = this.aEvents[iId];
	var fn;

	if (info["params"] == null) {
		fn = "()";
	} else {
		var p = info["params"].getParams();
		fn = "(" + p.join(",") + ")";
	}
	eval(info["obj"] + "." + info["method"] + fn);	
}

EventManager.prototype.handleEvent = function(e) {
	alert("blubb");
}