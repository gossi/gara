function Widget() {
	this.domref = null;
	//this.listeners = new Object();
}

Widget.prototype.addListener = function(eventType, listener) {
	try {
		gaia.getInterfaceTester().isListener(listener);
	} catch(e) {
		gaia.getExceptionHandler().exceptionRaised(e);
	}
	
	var eventListener = new EventListener();
	eventListener.setTarget(listener);
	eventListener.setMethod("handleEvent");
	
	if (this.domref != null) {
		var events = this.registerListener(eventType, eventListener);
		eventListener.events = events;
	}
	
	if (!this.listeners.hasOwnProperty(eventType)) {
		this.listeners[eventType] = new Array();
	}

	this.listeners[eventType].push(eventListener);
}

Widget.prototype.getDomRef = function() {
	return this.domref;
}

Widget.prototype.removeListener = function(eventType, listener) {
	// remove listener
	if (this.listeners[eventType].contains(listener)) {
		var iIndex = this.listeners[eventType].indexOf(listener);
		var eventListener = this.listeners[eventType][iIndex];
		this.listeners[eventType].remove(iIndex);
		
		if (eventListener.hasOwnProperty("events")) {
			for (var i = 0; i < eventListener.events.length; ++i) {
				var event = eventListener.events[i];
				gaia.getEventManager().removeEventListener(event);
			}
		}
		
		delete eventListener;
	}
}

/**
 * Sets the html node for this item
 * 
 * @author Thomas Gossmann
 * @param {HTMLElement} node the dom node for this item
 * @type void
 */
Widget.prototype.setDomRef = function(node) {
	this.domref = node;

	if (!this.domref.obj) {
		this.domref.obj = this;
	}
}