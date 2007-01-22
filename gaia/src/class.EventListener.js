/**
 * Event
 * 
 * @author Thomas Gossmann
 * @class RIAEvent
 * @constructor
 */
function EventListener() {
	/**
	 * Targetted Object
	 */
	this.target = null;

	/**
	 * Method of the target to call
	 */
	this.method = null;

	/**
	 * Function to call if not a method of an object
	 */
	this.fnct = null;

	/**
	 * The original Event object
	 */
	this.event = null;
}

//EventListener.prototype.addEventListener = function(htmlObject, eventType) {
//	this.manager.registerEvent(htmlObject, eventType, this);	
//}

/**
 * Implements IEventListener of the W3C Event-Model
 * 
 * @author Thomas Gossmann
 * @type void
 * @param {Event} the W3C Event
 */
EventListener.prototype.handleEvent = function(e) {
	if (e instanceof EventListener) {
		e = e.event;
	}
	e = e ? e : window.event;
	e.source = typeof(e.target) != "undefined" ? e.target : e.srcElement;
	// TODO: Check this!
//	e.x = e.pageX ? e.pageX : e.clientX;
//	e.y = e.pageY ? e.pageY : e.clientY;
	this.event = e;

	// stop bubbling
	if (this.event.stopPropagation) {
		this.event.stopPropagation();
		this.event.preventDefault();
	} else if (this.event.cancelBubble) {
		this.event.cancelBubble = true;
		this.event.returnValue  = false;
	}

	// execute
	if (this.fnct != null) {
		eval("this.fnct(this)");
	} else {
		var obj = this.target;
		eval("obj."+this.method+"(this)");
	}
}

EventListener.prototype.setFunction = function(fnct) {
	this.fnct = fnct;
}

EventListener.prototype.setManager = function(manager) {
	this.manager = manager;
}

EventListener.prototype.setMethod = function(method) {
	this.method = method;
}

EventListener.prototype.setTarget = function(target) {
	this.target = target;
}

EventListener.prototype.toString = function() {
	return "[object EventListener]";
}