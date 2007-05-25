/**
 * @class ControlManager
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @private
 */
$class("ControlManager", {
	$implements : FocusListener,
	
	_activeControl : null,
	_controls : [],
	$constructor : function() {
		gara.eventManager.addListener(window, "keydown", this);
		gara.eventManager.addListener(window, "mousedown", this);
	},

	addControl : function(control) {
		if (!this._controls.contains(control)) {
			this._controls.push(control);
		}
	},

	focusGained : function(control) {
		if (!$class.instanceOf(control, Control)) {
			throw new TypeError("control is not a Control");
		}
		
		console.log("focus gained");

		this._activeControl = control;
	},

	focusLost : function(control) {
		if (!$class.instanceOf(control, Control)) {
			throw new TypeError("control is not a Control");
		}

		if (this._activeControl == control) {
			this._activeControl = null;
		}
		// dummy method
	},

	handleEvent : function(e) {
		if (e.type == "keydown") {
			if (this._activeControl != null && this._activeControl.keyHandler) {
				this._activeControl.keyHandler(e);
			}
		}

		if (e.type == "mousedown") {
			console.log("ControlManager.handleEvent: mousedown");
			if (this._activeControl != null && e.target.control
				&& e.target.control != this._activeControl) {
				console.log("loose focus");
//				this._activeControl.looseFocus();
				this._activeControl = null;
			}
		}
	},

	removeControl : function(control) {
		if (this._controls.contains(control)) {
			if (this._activeControl == control) {
				this._activeControl = null;
			}
			this._controls.remove(control);
		}
	}
});

var ctrlManager = new ControlManager();