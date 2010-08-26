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
gara.use("gara.jswt.widgets.Shell");

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
	 * Holds the current focus control.
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
	 * Contains the widgets attached to this display
	 *
	 * @private
	 * @type gara.jswt.wigets.Widget[]
	 */
	widgets : [],

	/**
	 * @field
	 * Contains the shells attached to this display
	 *
	 * @private
	 * @type gara.jswt.wigets.Shell[]
	 */
	shells : [],

	/**
	 * @field
	 * static default display
	 *
	 * @private
	 * @type {gara.jswt.widgets.Display}
	 */
	defaultDisplay : gara.$static(null),
	
	/**
	 * @field
	 * 
	 * @private
	 * @type {gara.jswt.widgets.Shell}
	 */
	activeShell : null,

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
			this.widgets[this.widgets.length] = widget;
			widget.addDisposeListener(this.disposeListener);
			if (widget instanceof gara.jswt.widgets.Control) {
				widget.addListener("focus", this);
				widget.addListener("blur", this);
//
//				if (widget.getParent() instanceof gara.jswt.widgets.Widget) {
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
				if (widget instanceof gara.jswt.widgets.Shell && !this.shells.contains(widget)) {
					this.shells[this.shells.length] = widget;
				}
			}
		}
	},
	
	getActiveShell : function () {
		return this.activeShell;
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
	 * @summary
	 * Returns a (possibly empty) array containing the receiver's shells.
	 * 
	 * @description
	 * Returns a (possibly empty) array containing the receiver's shells. Shells are returned 
	 * in the order that they are drawn. The topmost shell appears at the beginning of the array. 
	 * Subsequent shells draw beneath this shell and appear later in the array. 
	 * 
	 * @return {gara.jswt.widgets.Shell[]} an array of children
	 */
	getShells : function () {
		var temp = {}, child, i, z, layers = {}, max = 0, shells = [];
	
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
				layers[i].forEach(function (shell) {
					shells[shells.length] = shell;
				}, this);
			}
		}
		
		return shells;
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
	 * Internal event handler to pass keyboard events and focussing the active
	 * widget
	 *
	 * @private
	 * @param {Event} e the event
	 * @return {void}
	 */
	handleEvent : function (e) {
		var control, parent, shell, success, layers, id, notifyResult;
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
				if (shell instanceof gara.jswt.widgets.Shell
						&& !control.handle.hasAttribute("suppressFocusNotify")
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
				if (!control.handle.hasAttribute("data-gara-suppressFocusNotify")) {
					notifyResult = control.notifyFocusListener("focusGained");
					success = success && 
						control.handle.hasAttribute("data-gara-forcefocus")
							? true
							: notifyResult;
				}
				this.focusControl = control;
				
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
			if (e.target.widget instanceof gara.jswt.widgets.Control
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
				
				if (widget instanceof gara.jswt.widgets.Shell) {
					this.shells.remove(widget);
				}
			}
			this.widgets.remove(widget);
		}
	},
	
	/**
	 * 
	 * @private
	 * @param {gara.jswt.widgets.Shell} shell
	 * @returns {void}
	 */
	setActiveShell : function (shell) {
		if (shell !== null && !(shell instanceof gara.jswt.widgets.Shell)) {
			throw new TypeError("shell is not a gara.jswt.widgets.Shell");
		}
		this.activeShell = shell;
	},
	
	/**
	 * 
	 * @private
	 * @param {gara.jswt.widgets.Control} control
	 * @returns {void}
	 */
	setFocusControl : function (control) {
		if (control !== null && !(control instanceof gara.jswt.widgets.Control)) {
			throw new TypeError("shell is not a gara.jswt.widgets.Control");
		}
		this.focusControl = control;
	}
})});