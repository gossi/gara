/*	$Id$

		gara - Javascript Toolkit
	===========================================================================

		Copyright (c) 2007 Thomas Gossmann
	
		Homepage:
			http://gara.creative2.net

		This library is free software;  you  can  redistribute  it  and/or
		modify  it  under  the  terms  of  the   GNU Lesser General Public
		License  as  published  by  the  Free Software Foundation;  either
		version 2.1 of the License, or (at your option) any later version.

		This library is distributed in  the hope  that it  will be useful,
		but WITHOUT ANY WARRANTY; without  even  the  implied  warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See  the  GNU
		Lesser General Public License for more details.

	===========================================================================
*/

/**
 * @class ControlManager
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @private
 */
$class("ControlManager", {
	$implements : gara.jswt.FocusListener,

	_instance : $static(null),

	$constructor : function() {
		this._activeControl = null;
		this._controls = [];

		base2.DOM.EventTarget(document);

		gara.EventManager.addListener(document, "keydown", this);
		gara.EventManager.addListener(document, "mousedown", this);
	},
	
	getInstance : $static(function() {
		if (this._instance == null) {
			this._instance = new gara.jswt.ControlManager();
		}

		return this._instance;
	}),

	addControl : function(control) {
		if (!this._controls.contains(control)) {
			this._controls.push(control);
		}
	},

	focusGained : function(control) {
		if (!$class.instanceOf(control, gara.jswt.Control)) {
			throw new TypeError("control is not a gara.jswt.Control");
		}
		
		if (this._activeControl != null && this._activeControl != control) {
			this._activeControl.looseFocus();
		}

		this._activeControl = control;
	},

	focusLost : function(control) {
		if (!$class.instanceOf(control, gara.jswt.Control)) {
			throw new TypeError("control is not a gara.jswt.Control");
		}

		if (this._activeControl == control) {
			this._activeControl = null;
		}
	},

	handleEvent : function(e) {
		switch(e.type) {
			case "mousedown":
				if (this._activeControl != null && (e.target.control
						? e.target.control != this._activeControl : true)) {
					this._activeControl.looseFocus();
					this._activeControl = null;
				}
				break;

			case "keydown":
				if (this._activeControl != null && this._activeControl.handleEvent) {
					this._activeControl.handleEvent(e);
				}
				break;
		}
	},

	removeControl : function(control) {
		if (!$class.instanceOf(control, gara.jswt.Control)) {
			throw new TypeError("control is not a gara.jswt.Control");
		}

		if (this._controls.contains(control)) {
			if (this._activeControl == control) {
				this._activeControl = null;
			}
			this._controls.remove(control);
		}
	},
	
	toString : function() {
		return "[gara.jswt.ControlManager]";
	}
});