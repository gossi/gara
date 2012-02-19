/*

		gara - Javascript Toolkit
	===========================================================================

		Copyright (c) 2007 Thomas Gossmann

		Homepage:
			http://garathekit.org

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

"use strict";

gara.provide("gara.widgets.Display");

//gara.use("gara.widgets.Widget");
//gara.use("gara.widgets.Control");
//gara.use("gara.widgets.Shell");

/**
 * @class gara.widgets.Display
 */
gara.widgets.Display = gara.Class(/** @lends gara.widgets.Display# */ {

	/**
	 * Holds the current focus control.
	 *
	 * @private
	 * @type gara.wigets.Control
	 */
	focusControl : null,

	/**
	 *
	 * @private
	 * @type Object
	 */
	disposeListener : null,

	/**
	 * Contains the widgets attached to this display
	 *
	 * @private
	 * @type gara.wigets.Widget[]
	 */
	widgets : [],

	/**
	 * Contains the shells attached to this display
	 *
	 * @private
	 * @type gara.wigets.Shell[]
	 */
	shells : [],

	/**
	 * 
	 * @private
	 * @type {gara.widgets.Shell}
	 */
	activeShell : null,
	
	/* Static properties */
	/** @lends gara.widgets.Display# */
	extend : {
		/**
		 * static default display
		 *
		 * @private
		 * @type {gara.widgets.Display}
		 */
		defaultDisplay : null,

		/**
		 * 
		 * @static
		 */
		getDefault : function () {
			if (gara.widgets.Display.defaultDisplay === null) {
				gara.widgets.Display.defaultDisplay = new gara.widgets.Display();
			}
			return gara.widgets.Display.defaultDisplay;
		},
	},

	/**
	 * @constructs
	 */
	constructor : function () {
		var self = this;
		gara.addEventListener(document, "keydown", this);
		gara.addEventListener(document, "keypress", this);
		gara.addEventListener(document, "keyup", this);
		
		this.disposeListener = {
			widgetDisposed : function (widget) {
				self.removeWidget(widget);
			}
		};
	},

	/**
	 * Adds a widget to the Display.
	 *
	 * @private
	 * @param {gara.widgets.Widget} widget the widget
	 * @returns {void}
	 */
	addWidget : function (widget) {
		var id;
		if (!(widget instanceof gara.widgets.Widget)) {
			throw new TypeError("widget is not a gara.widgets.Widget");
		}

		if (!this.widgets.contains(widget)) {
			this.widgets[this.widgets.length] = widget;
			widget.addDisposeListener(this.disposeListener);
			if (widget instanceof gara.widgets.Control) {
				widget.addListener("focus", this);
				widget.addListener("blur", this);
//
//				if (widget.getParent() instanceof gara.widgets.Widget) {
//					id = widget.getParent().getId();
//				}
//
//				// html node
//				else {
//					if (widget.getParent().id) {
//						id = widget.getParent().id;
//					} else {
//						id = gara.generateUID();
//						widget.getParent().id = id;
//					}
//				}
//
//
//				if (!this.layers[id]) {
//					this.layers[id] = [];
//				}
//
//				if (!this.layers[id].contains(widget)) {
//					this.layers[id].push(widget);
//				}
				if (widget instanceof gara.widgets.Shell && !this.shells.contains(widget)) {
					this.shells[this.shells.length] = widget;
				}
			}
		}
	},
	
	getActiveShell : function () {
		return this.activeShell;
	},

	/**
	 * 
	 * Returns a HTMLElement describes the area which is capable of displaying data.
	 * The &lt;body&gt; element.
	 *
	 * @returns {HTMLElement}
	 */
	getClientArea : function () {
		return document.getElementsByTagName("body")[0];
	},

	/**
	 * Returns the control which currently has keyboard focus, or null if
	 * keyboard events are not currently going to any of the controls built by
	 * the currently running application.
	 *
	 * @returns {gara.widgets.Control}
	 */
	getFocusControl : function () {
		return this.focusControl;
	},
	
	/**
	 * Returns a (possibly empty) array containing the receiver's shells.
	 * 
	 * @description
	 * Returns a (possibly empty) array containing the receiver's shells. Shells are returned 
	 * in the order that they are drawn. The topmost shell appears at the beginning of the array. 
	 * Subsequent shells draw beneath this shell and appear later in the array. 
	 * 
	 * @returns {gara.widgets.Shell[]} an array of children
	 */
	getShells : function () {
		var temp = {}, child, i, z, layers = {}, max = 0, shells = [],
			addShell = function (shell) {
				shells[shells.length] = shell;
			};
	
		this.shells.forEach(function (shell) {
			if (!shell.isDisposed()) {
				z = shell.handle.style.zIndex === "" ? 0 : shell.handle.style.zIndex;
				if (!layers[z]) {
					layers[z] = [];
				}
				layers[z][layers[z].length] = shell;
				max = Math.max(max, z);
			}
		}, this);
	
		for (i = max; i >= 0; i--) {
			if (layers[i]) {
				layers[i].forEach(addShell, this);
			}
		}
		
		return shells;
	},

	/**
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
	 * 
	 * Internal event handler to pass keyboard events and focussing the active
	 * widget
	 *
	 * @private
	 * @param {Event} e the event
	 * @returns {void}
	 */
	handleEvent : function (e) {
		var control, parent, shell, success, layers, id, notifyResult;
		switch (e.type) {
		case "keydown":
		case "keypress":
		case "keyup":
			if (this.focusControl !== null && this.focusControl.handleEvent) {
				e.widget = e.target.widget;
				e.control = this.focusControl;
				this.focusControl.handleEvent(e);
				
				if (e.item && e.item.listeners.hasOwnProperty(e.type)) {
					e.target.widget = e.item;
					e.item.listeners[e.type].forEach(function (listener) {
						if (typeof(listener) === "object" && listener.handleEvent) {
							listener.handleEvent(e);
						} else if (typeof(listener) === "function") {
							listener.call(null, e);
						}
					}, this);
				}
				e.target.widget = e.widget;
			}
			break;

		case "focus":
			if (e.target.widget instanceof gara.widgets.Control) {
				control = e.target.widget;
				success = true;
				layers = {};

				if (control === this.focusControl) {
					return;
				}
				
				// get shell
				shell = control.getShell();
				
				// handle layers
				// save layers
				this.widgets.forEach(function (widget) {
					layers[widget.handle.id] = widget.handle.style.zIndex;
				}, this);
				
				// move every layer in the control hierarchy from control to the shell on top
				control.moveAbove();
				parent = control;
				while (shell !== null && parent !== shell && parent.getParent) {
					parent.moveAbove();
					parent = parent.getParent();
				}
				
				// if parent is a shell and cannot be activated -> exit
				if (shell instanceof gara.widgets.Shell
						&& !control.handle.hasAttribute("data-gara-suppressFocusNotify")
						&& !shell.setActive()) {
					
					// restore layers, focus active shell and exit
					for (id in layers) {
						if (Object.prototype.hasOwnProperty.call(layers, id)) {
							document.getElementById(id).style.zIndex = layers[id];
						}
					}
					this.activeShell.setFocus();
					return false;
				}
				
				// notifyFocusListener
				this.focusControl = control;
				if (!control.handle.hasAttribute("data-gara-suppressFocusNotify")) {
					notifyResult = control.notifyFocusListener("focusGained");
					success = success && 
						control.handle.hasAttribute("data-gara-forcefocus")
							? true
							: notifyResult;
				}
				
				// remove obsolete data-gara-* attributes
				control.handle.removeAttribute("data-gara-suppressFocusNotify");
				control.handle.removeAttribute("data-gara-forcefocus");
				
				// restore layers, if something wasn't allowed
				if (!success) {
					for (id in layers) {
						if (Object.prototype.hasOwnProperty.call(layers, id)) {
							document.getElementById(id).style.zIndex = layers[id];
						}
					}

					this.focusControl = null;
					control.handle.setAttribute("data-gara-suppressBlurNotify", true);
					control.handle.blur();
				}
			}
			break;

		case "blur":
			if (e.target.widget instanceof gara.widgets.Control
					&& !e.target.hasAttribute("data-gara-suppressBlurNotify")) {
				
				if (e.target.widget.notifyFocusListener("focusLost")) {
					this.focusControl = null;
				} else {
					// workaround for re-focus
					// bug in FF, see: https://bugzilla.mozilla.org/show_bug.cgi?id=53579
					e.target.setAttribute("data-gara-suppressFocusNotify", true);
					setTimeout(function() {e.target.focus();}, 0);
				}	
			}
			
			e.target.removeAttribute("data-gara-suppressBlurNotify");
			break;
		}
	},

	/**
	 * Removes a widget from the Dialog. The Dialog removes the
	 * previous registered when added with addWidget.
	 *
	 * @private
	 * @param {gara.widgets.Widget} widget the widget
	 * @returns {void}
	 */
	removeWidget : function (widget) {
		if (!(widget instanceof gara.widgets.Widget)) {
			throw new TypeError("widget is not a gara.widgets.Widget");
		}

		if (this.widgets.contains(widget)) {
			if (this.focusControl === widget) {
				this.focusControl = null;
			}
			widget.removeDisposeListener(this.disposeListener);

			if (widget instanceof gara.widgets.Control) {
				widget.removeListener("focus", this);
				widget.removeListener("blur", this);
				
				if (widget instanceof gara.widgets.Shell) {
					this.shells.remove(widget);
				}
			}
			this.widgets.remove(widget);
		}
	},
	
	/**
	 * @private
	 * @param {gara.widgets.Shell} shell
	 * @returns {void}
	 */
	setActiveShell : function (shell) {
		if (shell !== null && !(shell instanceof gara.widgets.Shell)) {
			throw new TypeError("shell is not a gara.widgets.Shell");
		}
		this.activeShell = shell;
	},
	
	/**
	 * @private
	 * @param {gara.widgets.Control} control
	 * @returns {void}
	 */
	setFocusControl : function (control) {
		if (control !== null && !(control instanceof gara.widgets.Control)) {
			throw new TypeError("shell is not a gara.widgets.Control");
		}
		this.focusControl = control;
	}
});