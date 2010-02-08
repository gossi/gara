/*	$Id: Control.class.js 178 2009-07-26 15:50:44Z tgossmann $

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

gara.provide("gara.jswt.widgets.Control");

gara.use("gara.Utils");
gara.use("gara.jswt.JSWT");

gara.use("gara.jswt.events.FocusListener");
gara.use("gara.jswt.events.KeyListener");
gara.use("gara.jswt.events.MouseListener");

gara.use("gara.jswt.widgets.Composite");
gara.use("gara.jswt.widgets.Menu");

gara.require("gara.jswt.widgets.Widget");
gara.require("gara.jswt.widgets.FocusManager");

/**
 * @class Control
 * @author Thomas Gossmann
 * @extends gara.jswt.wigdets.Widget
 * @namespace gara.jswt.widgets
 */
gara.Class("gara.jswt.widgets.Control", {
	$extends : gara.jswt.widgets.Widget,

	/**
	 * @constructor
	 */
	$constructor : function(parent, style) {
		this.$base(parent, style);

		// flags and menu
		this._hasFocus = false;
		this._menu = null;
		this._enabled = true;
		this._initMouseListener = false;
		this._initKeyListener = false;

		// measurements
		this._width = null;
		this._height = null;

		// listener
		this._focusListener = [];
		this._keyListener = [];
		this._mouseListener = [];

		this._createWidget();

		// add to focus manager
		gara.jswt.widgets.FocusManager.addWidget(this);
	},

	/**
	 * @method
	 * Adds the listener to the collection of listeners who will be notified
	 * when the control gains or loses focus, by sending it one of the messages
	 * defined in the FocusListener interface.
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.FocusListener} listener the listener which should be notified
	 * @throws {TypeError} if the listener is not implementing the FocusListener interface
	 * @return {void}
	 */
	addFocusListener : function(listener) {
		if (!gara.implementationOf(listener, gara.jswt.events.FocusListener)) {
			throw new TypeError("listener is not a gara.jswt.events.FocusListener");
		}

		if (!this._focusListener.contains(listener)) {
			this._focusListener.push(listener);
		}
		return this;
	},

	/**
	 * @method
	 * Adds the listener to the collection of listeners who will be notified
	 * when keys are pressed and released on the system keyboard, by sending
	 * it one of the messages defined in the KeyListener interface.
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.KeyListener} listener the listener which should be notified
	 * @throws {TypeError} if the listener is not implementing the KeyListener interface
	 * @return {void}
	 */
	addKeyListener : function(listener) {
		if (!gara.implementationOf(listener, gara.jswt.events.KeyListener)) {
			throw new TypeError("listener is not a gara.jswt.events.KeyListener");
		}

		if (!this._keyListener.contains(listener)) {
			this._keyListener.push(listener);
		}

		if (!this._initKeyListener) {
			this.addListener("keydown", this);
			this.addListener("keyup", this);
			this._initKeyListener = true;
		}
		return this;
	},

	/**
	 * @method
	 * Adds the listener to the collection of listeners who will be notified
	 * when mouse buttons are pressed and released, by sending it one of the
	 * messages defined in the MouseListener interface.
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.MouseListener} listener the listener which should be notified
	 * @throws {TypeError} if the listener is not implementing the MouseListener interface
	 * @return {void}
	 */
	addMouseListener : function(listener) {
		if (!gara.implementationOf(listener, gara.jswt.events.MouseListener)) {
			throw new TypeError("listener is not a gara.jswt.events.MouseListener");
		}

		if (!this._mouseListener.contains(listener)) {
			this._mouseListener.push(listener);
		}

		if (!this._initMouseListener) {
			this.addListener("mousedown", this);
			this.addListener("mouseup", this);
			this.addListener("dblclick", this);
			this._initMouseListener = true;
		}
		return this;
	},

	_createWidget : function(element, preventAppending) {
		this.handle = document.createElement(element);
		this.handle.id = this.getId();
		this.handle.widget = this;
		this.handle.control = this;
		this.handle.tabIndex = this._enabled ? 0 : -1;
		this.handle.className = this._classes.join(" ");

		base2.DOM.Event(this.handle);

		// register listeners
		for (var eventType in this._listener) {
			this._listener[eventType].forEach(function(elem, index, arr) {
				this._registerListener(eventType, elem);
			}, this);
		}

		// add to dom
		if (!preventAppending) {
			if (gara.instanceOf(this._parent, gara.jswt.widgets.Composite)) {
				this._parentNode = this._parent.getClientArea();
			} else {
				this._parentNode = this._parent;
			}

			if (this._parentNode != null) {
				this._parentNode.appendChild(this.handle);
			}
		}
	},

	dispose : function() {
		this.$base();
		gara.jswt.widgets.FocusManager.removeWidget(this);
		this._focusListener = [];
		this._keyListener = [];
		this._mouseListener = [];
	},

	focusGained : function(e) {
		this._hasFocus = true;

		e.widget = this;
		e.control = this;

		// notify focus listeners
		for (var i = 0, len = this._focusListener.length; i < len; ++i) {
			this._focusListener[i].focusGained(e);
		}
	},

	focusLost : function(e) {
		this._hasFocus = false;

		e.widget = this;
		e.control = this;

		// notify focus listeners
		for (var i = 0, len = this._focusListener.length; i < len; ++i) {
			this._focusListener[i].focusLost(e);
		}
	},

	/**
	 * @method
	 * Forces this control to gain focus
	 *
	 * @return {void}
	 */
	forceFocus : function() {
		this.handle.focus();
	},

	getEnabled : function() {
		return this._enabled;
	},

	getHeight : function() {
		return this._height;
	},

	getWidth : function() {
		return this._width;
	},

	handleEvent: function(e) {
		// notify mouse and key listeners
		switch(e.type) {
			case "keydown":
				this._keyListener.forEach(function(listener) {
					listener.keyPressed(e);
				}, this);
				break;

			case "keyup":
				this._keyListener.forEach(function(listener) {
					listener.keyReleased(e);
				}, this);
				break;

			case "dblclick":
				this._mouseListener.forEach(function(listener) {
					listener.mouseDoubleClick(e);
				}, this);
				break;

			case "mousedown":
				this._mouseListener.forEach(function(listener) {
					listener.mouseDown(e);
				}, this);
				break;

			case "mouseup":
				this._mouseListener.forEach(function(listener) {
					listener.mouseUp(e);
				}, this);
				break;
		}
	},

	_handleContextMenu : function(e) {
		switch(e.type) {
			case "keydown":
				// context menu on shift + F10
				if (this._menu != null && e.shiftKey && e.keyCode == gara.jswt.JSWT.F10) {
					this._menu.update();
					this._menu.setLocation(e.clientX, e.clientY);
					this._menu.setVisible(true, e);
					e.preventDefault();
				}
				break;

			case "contextmenu":
				if (this._menu != null) {
					this._menu.update();
					this._menu.setLocation(e.clientX, e.clientY);
					this._menu.setVisible(true, e);
					e.preventDefault(); // hide browser context menu
				}
				break;

			/* Opera has no contextmenu event, so we go for Ctrl + mousedown
			 * See YUI blog for more information:
			 * http://yuiblog.com/blog/2008/07/17/context-menus-and-focus-in-opera/
			 */
			case "mousedown":
				if (window.opera
						&& (e.altKey || e.ctrlKey)
						&& this._menu != null) {
					this._menu.update();
					this._menu.setLocation(e.clientX, e.clientY);
					this._menu.setVisible(true, e);
				}
				break;
		}
	},

	/**
	 * @method
	 * Tells wether the control has focus or not
	 *
	 * @return {boolean} true for having the focus and false if not
	 */
	isFocusControl : function() {
		return this._hasFocus;
	},

	/**
	 * @method
	 * Forces this control to loose focus
	 *
	 * @return {void}
	 */
	looseFocus : function() {
		this.handle.blur();
	},

	/**
	 * @method
	 * Removes the listener from the collection of listeners who will be
	 * notified when the control gains or loses focus.
	 *
	 * @param {gara.jswt.events.FocusListener} listener the listener which should no longer be notified
	 * @throws {TypeError} wether this is not a FocusListener
	 * @return {void}
	 */
	removeFocusListener : function(listener) {
		if (!gara.implementationOf(listener, gara.jswt.events.FocusListener)) {
			throw new TypeError("listener is not a gara.jswt.events.FocusListener");
		}

		this._focusListener.remove(listener);
	},

	setEnabled : function(enabled) {
		this._enabled = enabled;
		this.handle.setAttribute("aria-disabled", !this._enabled);
		this.handle.tabIndex = this._enabled ? 0 : -1;
		return this;
	},

	setHeight : function(height) {
		this._height = height;
		this.handle.style.height = this._height != null ? (this._height - parseInt(gara.Utils.getStyle(this.handle, "padding-top")) - parseInt(gara.Utils.getStyle(this.handle, "padding-bottom")) - parseInt(gara.Utils.getStyle(this.handle, "border-top-width")) - parseInt(gara.Utils.getStyle(this.handle, "border-bottom-width"))) + "px" : "auto";
		return this;
	},

	setMenu : function(menu) {
		if (!gara.instanceOf(menu, gara.jswt.widgets.Menu)) {
			throw new TypeError("menu is not a gara.jswt.widgets.Menu");
		}

		this._menu = menu;
		this.addListener("contextmenu", this);
		this.addListener("mousedown", this);

		this.handle.setAttribute("aria-haspopup", true);
		this.handle.setAttribute("aria-owns", this._menu.getId());
		return this;
	},

	setWidth : function(width) {
		this._width = width;
		this.handle.style.width = this._width != null ? (this._width - parseInt(gara.Utils.getStyle(this.handle, "padding-left")) - parseInt(gara.Utils.getStyle(this.handle, "padding-right")) - parseInt(gara.Utils.getStyle(this.handle, "border-left-width")) - parseInt(gara.Utils.getStyle(this.handle, "border-right-width"))) + "px" : "auto";
		return this;
	},

	_topHandle : function() {
		return this.handle;
	},

	update : gara.abstract(function() {})
});