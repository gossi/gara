/*	$Id: ControlManager.class.js 181 2009-08-02 20:51:16Z tgossmann $

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
 * @class FocusManager
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @private
 */
$class("FocusManager", {

	_instance : $static(null),

	$constructor : function() {
		this._activeWidget = null;
		this._widgets = [];

		gara.EventManager.addListener(document, "keydown", this);
		gara.EventManager.addListener(document, "keypress", this);
		gara.EventManager.addListener(document, "keyup", this);
//		gara.EventManager.addListener(document, "mousedown", this);
	},

	getInstance : $static(function() {
		if (this._instance == null) {
			this._instance = new gara.jswt.widgets.FocusManager();
		}

		return this._instance;
	}),

	addWidget : $static(function(widget) {
		if (!$class.instanceOf(widget, gara.jswt.widgets.Widget)) {
			throw new TypeError("widget is not a gara.jswt.widgets.Widget");
		}

		var self = this.getInstance();
		if (!self._widgets.contains(widget)) {
			self._widgets.push(widget);
			widget.addListener("focus", self);
			widget.addListener("blur", self);
		}
	}),

	handleEvent : function(e) {
		switch(e.type) {
			case "keydown":
			case "keypress":
			case "keyup":
				if (this._activeWidget != null && this._activeWidget.handleEvent) {
					this._activeWidget.handleEvent(e);
				}
				break;

			case "focus":
				if ($class.instanceOf(e.target.widget, gara.jswt.widgets.Widget)) {
					if (e.target.widget.forceFocus) {
						e.target.widget.forceFocus(e);
					}
					this._activeWidget = e.target.widget;
				}
				break;

			case "blur":
				if ($class.instanceOf(e.target.widget, gara.jswt.widgets.Widget)) {
					if (e.target.widget.looseFocus) {
						e.target.widget.looseFocus(e);
					}
					this._activeWidget = null;
				}
				break;
		}
	},

	removeWidget : $static(function(widget) {
		if (!$class.instanceOf(widget, gara.jswt.widgets.Widget)) {
			throw new TypeError("widget is not a gara.jswt.widgets.Widget");
		}

		var self = this.getInstance();
		if (self._widgets.contains(widget)) {
			if (self._activeWidget == widget) {
				self._activeWidget = null;
			}
			widget.removeListener("focus", self);
			widget.removeListener("blur", self);
			self._widgets.remove(widget);
		}
	}),

	toString : function() {
		return "[gara.jswt.widgets.FocusManager]";
	}
});