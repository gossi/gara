function EventManager() {
	this.listeners = new Array();

	var cleanup = new EventListener();
	cleanup.setTarget(this);
	cleanup.setMethod("unregisterAllEvents");
	this.addEventListener(window, "unload", cleanup);
}

EventManager.prototype.addEventListener = function(domNode, eventType, listener) {
	var listenerFn = listener;
	if (domNode.addEventListener) {
		domNode.addEventListener(eventType, listenerFn, false);
	} else if (domNode.attachEvent) {
		listenerFn = function(e) {
			listener.handleEvent(e);
		}
		domNode.attachEvent("on" + eventType, listenerFn);
	} else {
		throw new Error("Event registration not supported");
	}
	var event = {
		domNode: domNode,
		eventType: eventType,
		listener: listenerFn
	};
	this.listeners.push(event);

//	gaia.getLog().addMessage("Add event handler: " + eventType + " on " + domNode.nodeName + "[" + domNode.innerHTML + "] obj(" + listener + ")");

	return event;
}

EventManager.prototype.removeEventListener = function(event) {
	var domNode = event.domNode;
	if (domNode.removeEventListener) {
		domNode.removeEventListener(event.eventType, event.listener, false);
	} else if (domNode.detachEvent) {
		domNode.detachEvent("on" + event.eventType, event.listener);
	}

	if (this.listeners.contains(event)) {
		var iIndex = this.listeners.indexOf(event);
		this.listeners.remove(iIndex);
	}

//	gaia.getLog().addMessage("Remove event handler: " + event.eventType + " on " + domNode.nodeName + "[" + domNode.innerHTML + "] obj(" + event.listener + ")");
}

EventManager.prototype.unregisterAllEvents = function() {
	while (this.listeners.length > 0) {
		var event = this.listeners.pop();
		var domNode = event.domNode;
		if (domNode.removeEventListener) {
			domNode.removeEventListener(event.eventType, event.listener, false);
		} else if (domNode.detachEvent) {
			domNode.detachEvent("on" + event.eventType, event.listener);
		}
	}
}