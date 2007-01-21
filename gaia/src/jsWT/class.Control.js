function Control() {
	this.aItems = new Array();
	this.sClassName = "jsWT";
	
	Widget.prototype.constructor.call(this);

	this.focushack = null;
	this.bHasFocus = false;
	this.aFocusListeners = new Array();

	// add Control to the ControlManager
	var ctrlManager = jsWT.getControlManager();
	ctrlManager.addControl(this);
	
	this.addFocusListener(ctrlManager);
}

Control.inheritsFrom(Widget);

Control.prototype.addClassName = function(sClassName) {
	this.sClassName += " " + sClassName;
}

/**
 * Adds a focus changed listener on the tree
 * 
 * @author Thomas Gossmann
 * @param {IFocusListener} the desired listener to be added to this control
 * @throws DefectInterfaceImplementation if the listener misses some methods
 * @type void
 */
Control.prototype.addFocusListener = function(listener) {
	try {
		gaia.getInterfaceTester().isFocusListener(listener);
	} catch(e) {
		gaia.getExceptionHandler().exceptionRaised(e);
	}

	this.aFocusListeners.push(listener);
}

Control.prototype.addItem = function(newItem) {
	
	if (!newItem instanceof Item) {
		return error('Control', 'addItem', 'New Item is not instance of Item');
	}
	
	this.aItems.push(newItem);
}

Control.prototype.forceFocus = function() {
	this.focushack.focus();
}

Control.prototype.isFocusControl = function() {
	return this.bHasFocus;
}

Control.prototype.looseFocus = function() {
	this.focushack.blur();
}

Control.prototype.onFocus = function() {
	this.bHasFocus = true;

	// notify focus listeners
	for (var i = 0; i < this.aFocusListeners.length; ++i) {
		this.aFocusListeners[i].focusGained(this);
	}
}

Control.prototype.onBlur = function() {
//	alert("widget blur");
	this.bHasFocus = false;

	// notify focus listeners
	for (var i = 0; i < this.aFocusListeners.length; ++i) {
		this.aFocusListeners[i].focusLost(this);
	}
}

Control.prototype.removeClassName = function(sClassName) {
	this.sClassName = strReplace(this.sClassName, " " + sClassName, "");
}

/**
 * Removes a focus listener from this control
 * 
 * @author Thomas Gossmann
 * @param {IFocusListener} the listener to remove from this control
 * @type void
 */
Control.prototype.removeFocusListener = function(listener) {
	if (this.aFocusListeners.contains(listener)) {
		var iOffset = this.aFocusListeners.getKey(listener);
		this.aFocusListeners.remove(iOffset);
	}
}

Control.prototype.setClassName = function(sClassName) {
	this.sClassName = sClassName;
}

Control.prototype.update = function() {
	this.paint();
}