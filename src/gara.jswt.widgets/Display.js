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

gara.provide("gara.jswt.widgets.Display");

gara.use("gara.jswt.widgets.Widget");
gara.use("gara.jswt.widgets.Control");
//gara.use("gara.jswt.widgets.Decorations");

gara.require("gara.EventManager");

/**
 * @class FocusManager
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @private
 */
gara.ready(function() {gara.Class("gara.jswt.widgets.Display", {

	/**
	 * @field
	 *
	 * @private
	 * @type gara.jswt.wigets.Control
	 */
	focusControl : null,

	/**
	 * @field
	 *
	 * @private
	 * @type Object
	 */
	disposeListener : null,

	/**
	 * @field
	 *
	 * @private
	 * @type gara.jswt.wigets.Widget[]
	 */
	widgets : [],

	layers : {},

	/**
	 * @field
	 * static default display
	 *
	 * @private
	 * @type {gara.jswt.widgets.Display}
	 */
	defaultDisplay : gara.$static(null),

	$constructor : function () {
		var self = this;
		gara.EventManager.addListener(document, "keydown", this);
		gara.EventManager.addListener(document, "keypress", this);
		gara.EventManager.addListener(document, "keyup", this);

		this.disposeListener = {
			widgetDisposed : function (widget) {
				self.removeWidget(widget);
			}
		};
	},

	/**
	 * @method
	 * Adds a widget to the Display.
	 *
	 * @private
	 * @param {gara.jswt.widgets.Widget} widget the widget
	 * @return {void}
	 */
	addWidget : function (widget) {
		var id;
		if (!(widget instanceof gara.jswt.widgets.Widget)) {
			throw new TypeError("widget is not a gara.jswt.widgets.Widget");
		}

		if (!this.widgets.contains(widget)) {
			this.widgets.push(widget);
			widget.addDisposeListener(this.disposeListener);
			if (widget instanceof gara.jswt.widgets.Control) {
				widget.addListener("focus", this);
				widget.addListener("blur", this);

				if (widget.getParent() instanceof gara.jswt.widgets.Widget) {
					id = widget.getParent().getId();
				}

				// html node
				else {
					if (widget.getParent().id) {
						id = widget.getParent().id;
					} else {
						id = gara.generateUID();
						widget.getParent().id = id;
					}
				}


				if (!this.layers[id]) {
					this.layers[id] = [];
				}

				if (!this.layers[id].contains(widget)) {
					this.layers[id].push(widget);
				}
			}
		}
	},

	/**
	 * @method
	 *
	 * @private
	 */
	bringLayerToFront : function (widget) {
		id = widget.getParent().getId ? widget.getParent().getId() : widget.getParent().id;
		if (Object.prototype.hasOwnProperty.call(this.layers, id)) {
			this.layers[id].remove(widget);
			this.layers[id].insertAt(0, widget);
			this.layers[id].forEach(function(widget, index, layers) {
				widget.handle.style.zIndex = 1 + (layers.length - index);
			}, this);
		}
	},

	/**
	 * @method
	 * Returns a HTMLElement describes the area which is capable of displaying data.
	 * The &lt;body&gt; element.
	 *
	 * @return {HTMLElement}
	 */
	getClientArea : function () {
		return document.getElementsByTagName("body")[0];
	},

	getDefault : gara.$static(function () {
		if (gara.jswt.widgets.Display.defaultDisplay === null) {
			gara.jswt.widgets.Display.defaultDisplay = new gara.jswt.widgets.Display();
		}
		return gara.jswt.widgets.Display.defaultDisplay;
	}),

	/**
	 * @method
	 * Returns the control which currently has keyboard focus, or null if
	 * keyboard events are not currently going to any of the controls built by
	 * the currently running application.
	 *
	 * @return {gara.jswt.widgets.Control}
	 */
	getFocusControl : function () {
		return this.focusControl;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	getSiblingControls : function (control) {
		var id;
		if (control.getParent && control.getParent().getId) {
			id = control.getParent().getId();
		} else if (control.getParent().id) {
			id = control.getParent().id;
		}

		if (this.layers[id]) {
			return this.layers[id];
		}

		return [];
	},

	/**
	 * @method
	 * Internal event handler to pass keyboard events and focussing the acitve
	 * widget
	 *
	 * @private
	 * @param {Event} e the event
	 * @return {void}
	 */
	handleEvent : function (e) {
		var widget, parent;
		switch (e.type) {
		case "keydown":
		case "keypress":
		case "keyup":
			if (this.focusControl !== null && this.focusControl.handleEvent) {
				this.focusControl.handleEvent(e);
			}
			break;

		case "focus":
			if (e.target.widget instanceof gara.jswt.widgets.Control) {
				// handle layers
				widget = e.target.widget;
				this.bringLayerToFront(widget);

				// handle parent decorations
				parent = widget.getParent();
				while (!(parent instanceof gara.jswt.widgets.Decorations) && parent.getParent) {
					parent = parent.getParent();
				}

				if (parent instanceof gara.jswt.widgets.Decorations) {
					this.bringLayerToFront(parent);
				}


				// pass focus to control
				this.focusControl = widget;
				widget.focusGained(e);
			}
			break;

		case "blur":
			if (e.target.widget instanceof gara.jswt.widgets.Control) {
				e.target.widget.focusLost(e);
				this.focusControl = null;
			}
			break;
		}
	},

	/**
	 * @method
	 * Removes a widget from the Dialog. The Dialog removes the
	 * previous registered when added with addWidget.
	 *
	 * @private
	 * @param {gara.jswt.widgets.Widget} widget the widget
	 * @return {void}
	 */
	removeWidget : function (widget) {
		if (!(widget instanceof gara.jswt.widgets.Widget)) {
			throw new TypeError("widget is not a gara.jswt.widgets.Widget");
		}

		if (this.widgets.contains(widget)) {
			if (this.focusControl === widget) {
				this.focusControl = null;
			}
			widget.removeDisposeListener(this.disposeListener);

			if (widget instanceof gara.jswt.widgets.Control) {
				widget.removeListener("focus", this);
				widget.removeListener("blur", this);
			}
			this.widgets.remove(widget);
		}
	}
})});