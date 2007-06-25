/**
 * @class ControlManager
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @private
 */
$class("ControlManager", {
	$implements : FocusListener,

	$constructor : function() {
		this._activeControl = null;
		this._controls = [];

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

		this._activeControl = control;
	},

	focusLost : function(control) {
		if (!$class.instanceOf(control, Control)) {
			throw new TypeError("control is not a Control");
		}

		if (this._activeControl == control) {
			this._activeControl = null;
		}
	},

	handleEvent : function(e) {
		if (e.type == "keydown") {
			if (this._activeControl != null && this._activeControl._handleKeyEvent) {
				this._activeControl._handleKeyEvent(e);
			}
		}

		if (e.type == "mousedown") {
			if (this._activeControl != null || (e.target.control
				&& e.target.control != this._activeControl)) {
				this._activeControl.looseFocus();
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