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

gara.provide("gara.jswt.widgets.Control", "gara.jswt.widgets.Widget");

gara.use("gara.jswt.JSWT");

//gara.use("gara.jswt.events.FocusListener");
//gara.use("gara.jswt.events.KeyListener");
//gara.use("gara.jswt.events.MouseListener");

gara.use("gara.jswt.widgets.Composite");
//gara.use("gara.jswt.widgets.Menu");
gara.use("gara.jswt.widgets.Display");

/**
 * @class Control
 * @author Thomas Gossmann
 * @extends gara.jswt.wigdets.Widget
 * @namespace gara.jswt.widgets
 */
gara.Class("gara.jswt.widgets.Control", function () { return {
	$extends : gara.jswt.widgets.Widget,

	/**
	 * @field
	 * Holds the focus state.
	 *
	 * @private
	 * @type {boolean}
	 */
	hasFocus : false,

	/**
	 * @field
	 * Contains the context menu.
	 *
	 * @private
	 * @type {gara.jswt.widgets.Menu}
	 */
	menu : null,

	/**
	 * @field
	 * Holds the enabled state.
	 *
	 * @private
	 * @type {boolean}
	 */
	enabled : true,

	/**
	 * @field
	 * Holds the visible state.
	 *
	 * @private
	 * @type {boolean}
	 */
	visible : true,

	/**
	 * @field
	 * X coordinate relative to the Control's parent
	 *
	 * @private
	 * @type {int}
	 */
	x : null,

	/**
	 * @field
	 * Y coordinate relative to the Control's parent
	 *
	 * @private
	 * @type {int}
	 */
	y : null,


	/**
	 * @field
	 * X Mouse Coordinate. Mouse Coords are used to show the context menu at this position.
	 *
	 * @private
	 * @type {int}
	 */
	mouseX : 0,

	/**
	 * @field
	 * Y Mouse Coordinate. Mouse Coords are used to show the context menu at this position.
	 *
	 * @private
	 * @type {int}
	 */
	mouseY : 0,

	/**
	 * @field
	 * Contains the Control's width. Null is auto.
	 *
	 * @private
	 * @type {int}
	 */
	width : 0,

	/**
	 * @field
	 * Contains the Control's height. Null is auto.
	 *
	 * @private
	 * @type {int}
	 */
	height : 0,

	/**
	 * @field
	 * Contains the focus listeners
	 *
	 * @private
	 * @type {gara.jswt.events.FocusListener[]}
	 */
	focusListeners : [],

	/**
	 * @field
	 * Contains the mouse listeners
	 *
	 * @private
	 * @type {gara.jswt.events.MouseListener[]}
	 */
	mouseListeners : [],

	/**
	 * @field
	 * Contains the key listeners
	 *
	 * @private
	 * @type {gara.jswt.events.KeyListener[]}
	 */
	keyListeners : [],

	/**
	 * @constructor
	 */
	$constructor : function (parent, style) {
		this.$super(parent, style);
		this.addClass("jsWTControl");

		this.focusListeners = [];
		this.mouseListeners = [];
		this.keyListeners = [];

		this.width = null;
		this.height = null;

		this.hasFocus = false;
		this.menu = null;
		this.enabled = true;
		this.visible = true;

		this.mouseX = 0;
		this.mouseY = 0;
		this.x = null;
		this.y = null;

		this.positionOffsetX = null;
		this.positionOffsetY = null;

		if (this.parent !== null && this.parent instanceof gara.jswt.widgets.Composite) {
			this.parentNode = this.parent.getClientArea();
		} else if ((this.parent !== null && this.parent instanceof gara.jswt.widgets.Display) || this.parent === null) {
			this.parentNode = this.parent.getClientArea();
		} else {
			this.parentNode = this.parent;
		}

		this.createWidget();

//		if (parent instanceof gara.jswt.widgets.Composite) {
//			parent.resize();
//		}

		// add to focus manager
//		gara.jswt.widgets.FocusManager.addWidget(this);
		this.display.addWidget(this);
	},

	/**
	 * @method
	 * Adds the listener to the collection of listeners who will be notified
	 * when the control gains or loses focus, by sending it one of the messages
	 * defined in the FocusListener interface.
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.FocusListener} listener the listener which should be notified
	 * @return {void}
	 */
	addFocusListener : function (listener) {
		if (!this.focusListeners.contains(listener)) {
			this.focusListeners.push(listener);
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
	 * @return {void}
	 */
	addKeyListener : (function () {
		var registered = false;
		return function (listener) {
			if (!this.keyListeners.contains(listener)) {
				this.keyListeners.push(listener);
			}

			if (!registered) {
				this.addListener("keydown", this);
				this.addListener("keyup", this);
				registered = true;
			}
			return this;
		};
	})(),

	/**
	 * @method
	 * Adds the listener to the collection of listeners who will be notified
	 * when mouse buttons are pressed and released, by sending it one of the
	 * messages defined in the MouseListener interface.
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.MouseListener} listener the listener which should be notified
	 * @return {void}
	 */
	addMouseListener : (function () {
		var registered = false;
		return function (listener) {
			if (!this.mouseListeners.contains(listener)) {
				this.mouseListeners.push(listener);
			}

			if (!registered) {
				this.addListener("mousedown", this);
				this.addListener("mouseup", this);
				this.addListener("dblclick", this);
				registered = true;
			}
			return this;
		};
	})(),

	adjustHeight : function (height) {},

	adjustWidth : function (width) {},

	/**
	 * @method
	 * Creates the widget. Should be overridden by subclasses.
	 *
	 * @private
	 */
	createWidget : function () {
		alert("Control.createWidget() invoked on Control " + this + ". Method not implemented");
	},

	/**
	 * @method
	 * Creates the dom node for the handle. Should be called by subclasses in createWidget.
	 *
	 * @private
	 * @param {String} element node name for the handle element
	 * @param {boolean} preventAppending when <code>true</code> the handles isn't appended to the parent
	 * @return {void}
	 */
	createHandle : function (element, preventAppending) {
		var eventType;
		this.handle = document.createElement(element);
		this.handle.id = this.getId();
		this.handle.widget = this;
		this.handle.control = this;
		this.handle.tabIndex = this.enabled ? 0 : -1;
		this.handle.className = this.classes.join(" ");

		// register listeners
		for (eventType in this.listeners) {
			this.listeners[eventType].forEach(function (elem, index, arr) {
				this.bindListener(eventType, elem);
			}, this);
		}

		if (!preventAppending) {
			this.addHandleToDOM();
		}
	},

	addHandleToDOM : function () {
		if (this.parentNode !== null) {
			this.parentNode.appendChild(this.handle);

			this.x = this.handle.offsetLeft;
			this.y = this.handle.offsetTop;
			this.positionOffsetX = this.handle.offsetLeft;
			this.positionOffsetY = this.handle.offsetTop;
		}
	},

	dispose : function () {
		this.$super();
		gara.jswt.widgets.FocusManager.removeWidget(this);
		this.focusListeners = [];
		this.keyListeners = [];
		this.mouseListeners = [];
	},

	/**
	 * @method
	 * This method is invoked by the <code>FocusManager</code> when the <code>Control</code>
	 * gains focus.
	 *
	 * @private
	 * @param {Event} e
	 * @return {void}
	 */
	focusGained : function (e) {
		this.hasFocus = true;

		e.widget = this;
		e.control = this;

		// notify focus listeners
		this.focusListeners.forEach(function (listener) {
			if (listener.focusGained) {
				listener.focusGained(e);
			}
		}, this);
	},

	/**
	 * @method
	 * This method is invoked by the <code>FocusManager</code> when the <code>Control</code>
	 * losts focus.
	 *
	 * @private
	 * @param {Event} e
	 * @return {void}
	 */
	focusLost : function (e) {
		this.hasFocus = false;

		e.widget = this;
		e.control = this;

		// notify focus listeners
		this.focusListeners.forEach(function (listener) {
			if (listener.focusLost) {
				listener.focusLost(e);
			}
		}, this);
	},

	/**
	 * @method
	 * Forces the <code>Control</code> to gain focus.
	 *
	 * @return {void}
	 */
	forceFocus : function () {
		this.handle.focus();
	},

	/**
	 * @method
	 * Returns <code>true</code> if the <code>Control</code> is enabled, and <code>false</code> otherwise.
	 *
	 * @returns {boolean} the <code>Control</code>'s enabled state
	 */
	getEnabled : function () {
		return this.enabled;
	},

	/**
	 * @method
	 * Returns <code>Control</code>'s height.
	 *
	 * @returns {int} the <code>Control</code>'s height in pixels
	 */
	getHeight : function () {
		return this.height;
	},

	/**
	 * @method
	 * Returns <code>Control</code>'s width.
	 *
	 * @returns {int} the <code>Control</code>'s width in pixels
	 */
	getWidth : function () {
		return this.width;
	},

	getVisible : function () {
		return this.visible;
	},

	/**
	 * @method
	 * Handles <code>Control</code> related events.
	 *
	 * @private
	 * @param {Event} e
	 * @return {void}
	 */
	handleEvent: function (e) {
		// notify mouse and key listeners
		switch (e.type) {
		case "keydown":
			this.keyListeners.forEach(function (listener) {
				if (listener.keyPressed) {
					listener.keyPressed(e);
				}
			}, this);
			break;

		case "keyup":
			this.keyListeners.forEach(function (listener) {
				if (listener.keyReleased) {
					listener.keyReleased(e);
				}
			}, this);
			break;

		case "dblclick":
			this.mouseListeners.forEach(function (listener) {
				if (listener.mouseDoubleClick) {
					listener.mouseDoubleClick(e);
				}
			}, this);
			break;

		case "mousedown":
			this.mouseListeners.forEach(function (listener) {
				if (listener.mouseDown) {
					listener.mouseDown(e);
				}
			}, this);
			break;

		case "mouseup":
			this.mouseListeners.forEach(function (listener) {
				if (listener.mouseUp) {
					listener.mouseUp(e);
				}
			}, this);
			break;

		case "mousemove":
			this.mouseX = (e.pageX || e.clientX + document.documentElement.scrollLeft) + 1;
			this.mouseY = (e.pageY || e.clientY + document.documentElement.scrollTop) + 1;
			break;
		}
	},

	/**
	 * @method
	 * Handles the <code>Control</code>'s <code>Menu</code>.
	 *
	 * @private
	 * @param {Event} e the user-event
	 * @return {void}
	 */
	handleMenu : function (e) {
		switch (e.type) {
		case "keydown":
			// context menu on shift + F10
			if (this.menu !== null && e.shiftKey && e.keyCode === gara.jswt.JSWT.F10) {
				this.menu.update();
				this.menu.setLocation(this.mouseX, this.mouseY);
				this.menu.setVisible(true, e);
				e.preventDefault();
			}
			break;

		case "contextmenu":
			if (this.menu !== null) {
				this.menu.update();
				this.menu.setLocation(this.mouseX, this.mouseY);
				this.menu.setVisible(true, e);
				e.preventDefault(); // hide browser context menu
			}
			break;

		// Opera has no contextmenu event, so we go for Ctrl + mousedown
		// See YUI blog for more information:
		// http://yuiblog.com/blog/2008/07/17/context-menus-and-focus-in-opera/
		case "mousedown":
			if (window.opera
					&& (e.altKey || e.ctrlKey)
					&& this.menu !== null) {
				this.menu.update();
				this.menu.setLocation(this.mouseX, this.mouseY);
				this.menu.setVisible(true, e);
			}
			break;
		}
	},

	/**
	 * @method
	 * Returns true if the <code>Control</code> has the user-interface focus, and false otherwise.
	 *
	 * @return {boolean} the <code>Control</code>'s focus state
	 */
	isFocusControl : function () {
		return this.hasFocus;
	},

	/**
	 * @method
	 * Forces this <code>Control</code> to loose focus.
	 *
	 * @return {void}
	 */
	looseFocus : function () {
		this.handle.blur();
	},

	/**
	 * @method
	 * Prevents the browser from scrolling the window. Prevents the default when
	 * the either one of the following keys is pressed:
	 * <ul>
	 * 	<li>Arrow Keys</li>
	 *	<li>Page up and down keys</li>
	 *	<li>Home Key</li>
	 *	<li>End Key</li>
	 *	<li>Spacebar</li>
	 * </ul>
	 *
	 * @private
	 */
	preventScrolling : function (e) {
		if (e.keyCode === gara.jswt.JSWT.ARROW_UP || e.keyCode === gara.jswt.JSWT.ARROW_DOWN
				|| e.keyCode === gara.jswt.JSWT.ARROW_LEFT || e.keyCode === gara.jswt.JSWT.ARROW_RIGHT
				|| e.keyCode === gara.jswt.JSWT.PAGE_UP || e.keyCode === gara.jswt.JSWT.PAGE_DOWN
				|| e.keyCode === gara.jswt.JSWT.HOME || e.keyCode === gara.jswt.JSWT.END
				|| e.keyCode === gara.jswt.JSWT.SPACE) {
			//  || (e.keyCode === 65 && e.ctrlKey) ctrl + a
			e.preventDefault();
		}
	},

	/**
	 * @method
	 * Removes the listener from the collection of listeners who will be
	 * notified when the control gains or loses focus.
	 *
	 * @param {gara.jswt.events.FocusListener} listener the listener which should no longer be notified
	 * @return {void}
	 */
	removeFocusListener : function (listener) {
		this.focusListeners.remove(listener);
	},

	/**
	 * @method
	 * Removes the listener from the collection of listeners who will be notified
	 * when keys are pressed and released on the system keyboard, by sending
	 * it one of the messages defined in the <code>KeyListener</code> interface.
	 *
	 * @param {gara.jswt.events.KeyListener} listener the listener which should be notified
	 * @return {void}
	 */
	removeKeyListener : function (listener) {
		this.keyListeners.remove(listener);
	},

	/**
	 * @method
	 * Removes the listener from the collection of listeners who will be notified
	 * when mouse buttons are pressed and released, by sending it one of the
	 * messages defined in the <code>MouseListener</code> interface.
	 *
	 * @param {gara.jswt.events.MouseListener} listener the listener which should be notified
	 * @return {void}
	 */
	removeMouseListener : function (listener) {
		this.mouseListeners.remove(listener);
	},

	/**
	 * @method
	 * Sets the enabled state for this <code>Control</code>.
	 *
	 * @param {boolean} enabled true for enabled and false for disabled state
	 * @return {void}
	 */
	setEnabled : function (enabled) {
		this.enabled = enabled;
		this.handle.setAttribute("aria-disabled", !this.enabled);
		this.handle.tabIndex = this.enabled ? 0 : -1;
		return this;
	},

	/**
	 * @method
	 * Sets the height for the <code>Control</code> in pixels.
	 *
	 * @param {mixed} height the new height <ul>
	 * 	<li>height > 1: height in pixels</li>
	 * 	<li>height = [0; 1]: height in percent</li>
	 * 	<li>height = null: height is auto</li>
	 * </ul>
	 * @return {gara.jswt.widgets.Control}
	 */
	setHeight : function (height) {
//		console.log("Control.setHeight: " + height);

		// absolute value
		if (height > 1) {
			this.height = parseInt(height);
			//this.handle.style.height = this.height - gara.getNumStyle(this.handle, "padding-top") - gara.getNumStyle(this.handle, "padding-bottom") - gara.getNumStyle(this.handle, "margin-top") - gara.getNumStyle(this.handle, "margin-bottom")- gara.getNumStyle(this.handle, "border-top-width") - gara.getNumStyle(this.handle, "border-bottom-width") + "px";
			this.handle.style.height = this.height + "px";
			this.adjustHeight(this.height);
		}

		// auto => null
		else if (height === null) {
			this.height = null;
			this.handle.style.height = "auto";
		}

		// percentage
		else if (height >= 0 && height <= 1) {
			this.height = parseInt(height * 1000) / 1000;
			this.handle.style.height = this.height * 100 + "%";
			this.adjustHeight(this.handle.offsetHeight);
		}

		return this;
	},


	setLocation : function (x, y) {
		if (x > 0) {
			this.x = x;
			this.handle.style.left = (x - this.positionOffsetX) + "px";
		}

		if (y > 0) {
			this.y = y;
			this.handle.style.top = (y - this.positionOffsetY) + "px";
		}

		return this;
	},

	/**
	 * @method
	 * Sets a <code>Menu</code> for this <code>Control</code>.
	 *
	 * @param {gara.jswt.widget.Menu} menu the new <code>Menu</code>
	 * @throws {TypeError} if the menu is not instance of <code>gara.jswt.widgets.Menu</code>
	 * @return {gara.jswt.widgets.Control}
	 */
	setMenu : function (menu) {
		if (menu !== null && !(menu instanceof gara.jswt.widgets.Menu)) {
			throw new TypeError("menu is not a gara.jswt.widgets.Menu");
		}

		// remove menu
		if (this.menu && menu === null) {
			this.removeListener("contextmenu", this);
			this.removeListener("mousedown", this);
			gara.EventManager.removeListener(document, "mousemove", this);

			this.handle.setAttribute("aria-haspopup", false);
			this.handle.removeAttribute("aria-owns");
		}

		// set menu
		else {
			this.addListener("contextmenu", this);
			this.addListener("mousedown", this);
			gara.EventManager.addListener(document, "mousemove", this);

			this.handle.setAttribute("aria-haspopup", true);
			this.handle.setAttribute("aria-owns", menu.getId());
		}
		this.menu = menu;
		return this;
	},

	/**
	 * @method
	 *
	 */
	setVisible : function (visible) {
		this.visible = visible;
		this.handle.style.display = visible ? "block" : "none";
	},

	/**
	 * @method
	 * Sets the width for the <code>Control</code> in pixels.
	 *
	 * @param {mixed} width the new width <ul>
	 * 	<li>width > 1: width in pixels</li>
	 * 	<li>width = [0; 1]: width in percent</li>
	 * 	<li>else: width is auto</li>
	 * </ul>
	 * @return {gara.jswt.widgets.Control}
	 */
	setWidth : function (width) {
		// absolute value
		if (width > 1) {
			this.width = parseInt(width);
			//this.handle.style.width = this.width - gara.getNumStyle(this.handle, "padding-left") - gara.getNumStyle(this.handle, "padding-right") - gara.getNumStyle(this.handle, "margin-left") - gara.getNumStyle(this.handle, "margin-right")- gara.getNumStyle(this.handle, "border-left-width") - gara.getNumStyle(this.handle, "border-right-width") + "px";
			this.handle.style.width = this.width + "px";
			this.adjustWidth(this.width);
		}

		// percentage
		else if (width >= 0 && width <= 1) {
			this.width = parseInt(width * 100) / 100;
			this.handle.style.width = this.width * 100 + "%";
			this.adjustWidth(this.handle.offsetWidth);
		}

		// auto => null
		else {
			this.width = null;
			this.handle.style.width = "auto";
		}

		return this;
	},

	/**
	 * @method
	 * Returns the top handle.
	 *
	 * @private
	 * @return {HTMLElement}
	 */
	topHandle : function () {
		return this.handle;
	},

	/**
	 * @method
	 * Updates the <code>Control</code>. Does some outstanding paint processes or
	 * remeasures the boundaries
	 *
	 * @return {void}
	 */
	update : function () {
		alert("Control.update() invoked on " + this + ". Method not implemented");
	}
};});