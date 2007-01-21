function ControlManager() {
	this.activeControl = null;
	this.controls = new Array();
	
	var listener = {
		controlManager : null,
		setControlManager : function(cm) {
			this.controlManager = cm;
		},
		handleEvent : function(e) {
			e = e ? e : window.event;
			e.source = e.target ? e.target : e.srcElement;
			e.x = e.pageX ? e.pageX : e.clientX;
			e.y = e.pageY ? e.pageY : e.clientY;
			this.event = e;
			var cm = this.controlManager;
			eval("cm.handleEvent(this)");
		}
	};
	listener.setControlManager(this);

	var em = gaia.getEventManager();
	em.addEventListener(window, "keydown", listener);
	em.addEventListener(window, "mousedown", listener);
}

ControlManager.prototype.addControl = function(control) {
	if (!this.controls.contains(control)) {
		this.controls.push(control);
	}
}

ControlManager.prototype.focusGained = function(control) {
	if (!control instanceof Control) {
		throw new WrongObjectException("control is not instance of Control", "ControlManager", "focusGained");
	}

	this.activeControl = control;
}

ControlManager.prototype.focusLost = function(control) {
	// dummy method
}

ControlManager.prototype.handleEvent = function(e) {
	if (e.event.type == "keydown") {
		if (this.activeControl != null && this.activeControl.keyHandler) {
			this.activeControl.keyHandler(e);
		}
	}

	if (e.event.type == "mousedown") {
		if (this.activeControl != null) {
			this.activeControl.looseFocus();
			this.activeControl = null;
		}
	}
}

ControlManager.prototype.removeControl = function(control) {
	if (this.controls.contains(control)) {
		if (this.activeControl == control) {
			this.activeControl = null;
		}
		var iIndex = this.controls.indexOf(control);
		this.controls.remove(iIndex);
	}
}

ControlManager.prototype.toString = function() {
	return "[object ControlManager]";
}