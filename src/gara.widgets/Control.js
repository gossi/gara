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

gara.provide("gara.widgets.Control", "gara.widgets.Widget");

gara.use("gara.widgets.Item");
gara.use("gara.widgets.Composite");
gara.use("gara.widgets.Menu");
gara.use("gara.widgets.Display");

/**
 * Some exemplary description
 * 
 * @class gara.widgets.Control
 * @extends gara.widgets.Widget
 */
gara.Class("gara.widgets.Control", function () { return /** @lends gara.widgets.Control# */{
	$extends : gara.widgets.Widget,

	/**
	 * Holds the focus state.
	 *
	 * @private
	 * @type {boolean}
	 */
	hasFocus : false,

	/**
	 * Contains the context menu.
	 *
	 * @private
	 * @type {gara.widgets.Menu}
	 */
	menu : null,

	/**
	 * Holds the enabled state.
	 *
	 * @private
	 * @type {boolean}
	 */
	enabled : true,

	/**
	 * Holds the visible state.
	 *
	 * @private
	 * @type {boolean}
	 */
	visible : true,

	/**
	 * X coordinate relative to the Control's parent
	 *
	 * @private
	 * @type {int}
	 */
	x : null,

	/**
	 * Y coordinate relative to the Control's parent
	 *
	 * @private
	 * @type {int}
	 */
	y : null,


	/**
	 * X Mouse Coordinate. Mouse Coords are used to show the context menu at this position.
	 *
	 * @private
	 * @type {int}
	 */
	mouseX : 0,

	/**
	 * Y Mouse Coordinate. Mouse Coords are used to show the context menu at this position.
	 *
	 * @private
	 * @type {int}
	 */
	mouseY : 0,

	/**
	 * Contains the Control's width. Null is auto.
	 *
	 * @private
	 * @type {int}
	 */
	width : 0,

	/**
	 * Contains the Control's height. Null is auto.
	 *
	 * @private
	 * @type {int}
	 */
	height : 0,

	/**
	 * @constructs
	 * @extends gara.widgets.Widget
	 */
	$constructor : function (parent, style) {
		this.$super(parent, style);
		this.addClass("garaControl");

		this.controlListeners = [];
		this.focusListeners = [];
		this.keyListeners = [];
		this.mouseListeners = [];
		this.mouseMoveListeners = [];
		this.mouseTrackListeners = [];
		this.mouseWheelListeners = [];

		this.width = null;
		this.height = null;

		this.hasFocus = false;
		this.menu = null;
		this.enabled = true;
		this.visible = true;
		this.hovering = false;

		this.mouseX = 0;
		this.mouseY = 0;
		this.x = null;
		this.y = null;

		this.positionOffsetX = null;
		this.positionOffsetY = null;

		if (this.parent !== null && this.parent instanceof gara.widgets.Composite) {
			this.parentNode = this.parent.getClientArea();
		} else if ((this.parent !== null && this.parent instanceof gara.widgets.Display) || this.parent === null) {
			this.parentNode = this.parent.getClientArea();
		} else {
			this.parentNode = this.parent;
		}
		
		this.shell = parent.getShell ? parent.getShell() : null;

		this.createWidget();
		this.display.addWidget(this);
	},

	/**
	 * Adds the listener to the collection of listeners who will be notified when the control 
	 * is moved or resized, by sending it one of the messages defined in the 
	 * <code>ControlListener</code> interface. 
	 *
	 * @param {gara.events.ControlListener} listener the listener which should be notified
	 * @returns {gara.widgets.Control} this
	 */
	addControlListener : function (listener) {
		this.checkWidget();
		if (!this.controlListeners.contains(listener)) {
			this.controlListeners.add(listener);
		}
		return this;
	},
	
	/**
	 * Adds the listener to the collection of listeners who will be notified
	 * when the control gains or loses focus, by sending it one of the messages
	 * defined in the <code>FocusListener</code> interface.
	 *
	 * @param {gara.events.FocusListener} listener the listener which should be notified
	 * @returns {gara.widgets.Control} this
	 */
	addFocusListener : function (listener) {
		this.checkWidget();
		if (!this.focusListeners.contains(listener)) {
			this.focusListeners.add(listener);
		}
		return this;
	},

	/**
	 * Adds the listener to the collection of listeners who will be notified
	 * when keys are pressed and released on the system keyboard, by sending
	 * it one of the messages defined in the <code>KeyListener</code> interface.
	 *
	 * @function
	 * @param {gara.events.KeyListener} listener the listener which should be notified
	 * @returns {gara.widgets.Control} this
	 */
	addKeyListener : function (listener) {
		this.checkWidget();
		if (!this.keyListeners.contains(listener)) {
			this.keyListeners.add(listener);
		}
		// key events are automatically passed to the focus control, so no special registration here
		return this;
	},

	/**
	 * Adds the listener to the collection of listeners who will be notified
	 * when mouse buttons are pressed and released, by sending it one of the
	 * messages defined in the <code>MouseListener</code> interface.
	 *
	 * @function
	 * @param {gara.events.MouseListener} listener the listener which should be notified
	 * @returns {gara.widgets.Control} this
	 */
	addMouseListener : (function () {
		var registered = false;
		return function (listener) {
			this.checkWidget();
			if (!this.mouseListeners.contains(listener)) {
				this.mouseListeners.add(listener);
			}

			if (!registered) {
				this.addListener("mousedown", this);
				this.addListener("mouseup", this);
				this.addListener("dblclick", this);
				registered = true;
			}
			return this;
		};
	}()),
	
	/**
	 * Adds the listener to the collection of listeners who will be notified 
	 * when the mouse moves, by sending it one of the messages defined in the 
	 * <code>MouseMoveListener</code> interface. 
	 *
	 * @function
	 * @param {gara.events.MouseMoveListener} listener the listener which should be notified
	 * @returns {gara.widgets.Control} this
	 */
	addMouseMoveListener : (function () {
		var registered = false;
		return function (listener) {
			this.checkWidget();
			if (!this.mouseMoveListeners.contains(listener)) {
				this.mouseMoveListeners.add(listener);
			}

			if (!registered) {
				this.addListener("mousemove", this);
				registered = true;
			}
			return this;
		};
	}()),
	
	/**
	 * Adds the listener to the collection of listeners who will be notified
	 * when the mouse passes or hovers over controls, by sending it one of the
	 * messages defined in the <code>MouseTrackListener</code> interface. 
	 *
	 * @function
	 * @param {gara.events.MouseTrackListener} listener the listener which should be notified
	 * @returns {gara.widgets.Control} this
	 */
	addMouseTrackListener : (function () {
		var registered = false;
		return function (listener) {
			this.checkWidget();
			if (!this.mouseTrackListeners.contains(listener)) {
				this.mouseTrackListeners.add(listener);
			}

			if (!registered) {
				this.addListener("mouseover", this);
				this.addListener("mouseout", this);
				registered = true;
			}
			return this;
		};
	}()),

	/**
	 * Adds the listener to the collection of listeners who will be notified 
	 * when the mouse wheel is scrolled, by sending it one of the 
	 * messages defined in the <code>MouseWheelListener</code> interface. 
	 *
	 * @function
	 * @param {gara.events.MouseWheelListener} listener the listener which should be notified
	 * @returns {gara.widgets.Control} this
	 */
	addMouseWheelListener : (function () {
		var registered = false;
		return function (listener) {
			this.checkWidget();
			if (!this.mouseWheelListeners.contains(listener)) {
				this.mouseWheelListeners.add(listener);
			}

			if (!registered) {
				this.addListener("mousewheel", this);
				registered = true;
			}
			return this;
		};
	}()),

	/**
	 * Adjust the height of the receiver. For internal usage only.
	 * 
	 * @private
	 * @param {int} height the new height
	 * @returns {void}
	 */
	adjustHeight : function (height) {
		// absolute value
		if (height > 1) {
			this.handle.style.height = parseInt(height, 10) + "px";
		}

		// null => auto
		else if (height === null) {
			this.handle.style.height = "auto";
		}

		// percentage
		else if (height >= 0 && height <= 1) {
			this.handle.style.height = height * 100 + "%";
		}
	},

	/**
	 * Adjust the width of the receiver. For internal usage only.
	 * 
	 * @private
	 * @param {int} width the new width
	 * @returns {void}
	 */
	adjustWidth : function (width) {
		// absolute value
		if (width > 1) {
			this.handle.style.width = parseInt(width, 10) + "px";
		}

		// null => auto
		else if (width === null) {
			this.handle.style.width = "auto";
		}
		
		// percentage
		else if (width >= 0 && width <= 1) {
			this.handle.style.width = width * 100 + "%";
		}
	},

	/**
	 * Internal method for creating a node representing an item. This is used for
	 * creating a new item or put updated content to an existing node of an earlier
	 * painted item. Should be overridden by subclasses.
	 *
	 * @private
	 */
	createWidget : function () {
//		alert("Control.createWidget() invoked on Control " + this + ". Method not implemented");
	},

	/**
	 * Creates the dom node for the handle. Should be called by subclasses in createWidget.
	 *
	 * @private
	 * @param {String} element node name for the handle element
	 * @param {boolean} preventAppending when <code>true</code> the handles isn't appended to the parent
	 * @returns {void}
	 */
	createHandle : function (element, preventAppending) {
		var eventType, i, len;
		this.handle = document.createElement(element);
		this.handle.id = this.getId();
		this.handle.widget = this;
		this.handle.control = this;
		this.handle.tabIndex = this.enabled ? 0 : -1;
		this.handle.className = this.classes.join(" ");

		// register listeners
		for (eventType in this.listeners) {
//			this.listeners[eventType].forEach(function (elem, index, arr) {
//				this.bindListener(eventType, elem);
//			}, this);
			if (Object.prototype.hasOwnProperty.call(this.listeners, eventType)) {
				for (i = 0, len = this.listeners[eventType].length; i < len; i++) {
					this.bindListener(eventType, this.listeners[eventType][i]);
				}
			}
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

	destroyWidget : function () {
		this.display.removeWidget(this);
		
		if (this.parentNode !== null) {
			try {
				this.parentNode.removeChild(this.handle);
			} catch (e) {}
		}
		
		this.controlListeners = [];
		this.focusListeners = [];
		this.keyListeners = [];
		this.mouseListeners = [];
		this.mouseMoveListeners = [];
		this.mouseTrackListeners = [];
		this.mouseWheelListeners = [];

		this.shell = null;
		this.parentNode = null;
		
		this.$super();
	},

	/**
	 * Forces the receiver to gain focus.
	 *
	 * @returns {void}
	 */
	forceFocus : function () {
		this.handle.setAttribute("data-gara-forcefocus", true);
		this.handle.focus();
	},

	/**
	 * Returns <code>true</code> if the receiver is enabled, and <code>false</code> otherwise.
	 *
	 * @returns {boolean} the receiver's enabled state
	 */
	getEnabled : function () {
		return this.enabled;
	},

	/**
	 * Returns the receiver's height.
	 *
	 * @returns {int} the receivers height in pixels
	 */
	getHeight : function () {
		return this.height;
	},
	
	/**
	 * Returns the receiver's location.
	 * 
	 * @returns {Object} obj.x contains the left offset and obj.y the top offset
	 */
	getLocation : function () {
		return {
			x: this.x,
			y: this.y
		};
	},
	
	/**
	 * Returns the receiver's shell.
	 * 
	 * @returns {gara.widgets.Shell}
	 */
	getShell : function () {
		return this.shell;
	},

	/**
	 * Returns the receiver's width.
	 *
	 * @returns {int} the <code>Control</code>'s width in pixels
	 */
	getWidth : function () {
		return this.width;
	},

	/**
	 * Returns the receiver's visibility.
	 * 
	 * @returns {boolean} true if visible
	 */
	getVisible : function () {
		return this.visible;
	},

	/**
	 * Handles <code>Control</code> related events.
	 *
	 * @private
	 * @param {Event} e
	 * @returns {void}
	 */
	handleEvent: function (e) {
		if (this.isDisposed()) {
			return;
		}

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
			
			this.mouseMoveListeners.forEach(function (listener) {
				if (listener.mouseMove) {
					listener.mouseMove(e);
				}
			}, this);
			break;

		case "mouseover":
			if (e.target.widget === this || (e.target.widget instanceof gara.widgets.Item && e.target.control === this)) {
				if (!this.hovering) {
					this.mouseTrackListeners.forEach(function (listener) {
						if (listener.mouseEnter) {
							listener.mouseEnter(e);
						}
					}, this);
					this.hovering = true;
				}
	
				this.mouseTrackListeners.forEach(function (listener) {
					if (listener.mouseHover) {
						listener.mouseHover(e);
					}
				}, this);
			}
			break;

		case "mouseout":
			if (!e.relatedTarget || typeof e.relatedTarget.widget === "undefined" || (e.relatedTarget.widget !== this 
					&& e.relatedTarget.widget instanceof gara.widgets.Item && e.relatedTarget.control !== this)) {
			
				this.mouseTrackListeners.forEach(function (listener) {
					if (listener.mouseExit) {
						listener.mouseExit(e);
					}
				}, this);
				this.hovering = false;
			}
			break;

		case "mousewheel":
			this.mouseWheelListeners.forEach(function (listener) {
				if (listener.mouseScrolled) {
					listener.mouseScrolled(e);
				}
			}, this);
			break;
		}
		
//		this.$super(e);
	},

	/**
	 * Handles the receiver's <code>Menu</code>.
	 *
	 * @private
	 * @param {Event} e the user-event
	 * @returns {void}
	 */
	handleMenu : function (e) {
		switch (e.type) {
		case "keydown":
			// context menu on shift + F10
			if (this.menu !== null && e.shiftKey && e.keyCode === gara.F10) {
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
	 * Returns true if the receiver has <i>keyboard-focus</i>, and false otherwise.
	 *
	 * @returns {boolean} the receiver's focus state
	 */
	isFocusControl : function () {
		return this.display.getFocusControl() === this;
	},
	
	menuShell : function () {
		if (this.parent.menuShell) {
			return this.parent.menuShell();
		}
		return null;
	},

	/**
	 * @summary
	 * Moves the receiver above the specified control in the drawing order.
	 * 
	 * @description
	 * Moves the receiver above the specified control in the drawing order. If no argument, 
	 * then the receiver is moved to the top of the drawing order. The control at the top of the 
	 * drawing order will not be covered by other controls even if they occupy intersecting areas. 
	 *
	 * @param {gara.widgets.Control} control the sibling control (optional)
	 * @returns {void}
	 */
	moveAbove : function (control) {
		var layers;

		if (this.getParent().getChildren) {
			layers = this.getParent().getChildren();
			layers.remove(this);
			layers.insertAt(control && layers.contains(control) ? layers.indexOf(control) : 0, this);
			layers.forEach(function(widget, index, layers) {
				widget.handle.style.zIndex = 1 + (layers.length - index);
			}, this);
		}
	},

	/**
	 * @summary
	 * Moves the receiver below the specified control in the drawing order.
	 * 
	 * @description
	 * Moves the receiver below the specified control in the drawing order. If no argument, 
	 * then the receiver is moved to the bottom of the drawing order. The control at the bottom of 
	 * the drawing order will be covered by all other controls which occupy intersecting areas. 
	 *
	 * @param {gara.widgets.Control} control the sibling control (optional)
	 * @returns {void}
	 */
	moveBelow : function (control) {
		var layers;

		if (this.getParent().getChildren) {
			layers = this.getParent().getChildren();
			layers.remove(this);
			layers.insertAt(control && layers.contains(control) ? layers.indexOf(control) + 1 : layers.length, this);
			layers.forEach(function(widget, index, layers) {
				widget.handle.style.zIndex = 1 + (layers.length - index);
			}, this);
		}
	},

	/**
	 * @private
	 * @param eventType
	 * @returns {boolean} true if the operation is permitted
	 */
	notifyFocusListener : function (eventType) {
		var ret = true, 
			e = this.event || window.event || {};
			e.widget = this;
			e.control = this;

		this.focusListeners.forEach(function (listener) {
			var answer;

			if (listener[eventType]) {
				answer = listener[eventType](e);
				if (typeof(answer) !== "undefined") {
					ret = answer;
				}
			}
		}, this);
		return ret;
	},
	
	/**
	 * @private
	 * @param eventType
	 * @returns {boolean} true if the operation is permitted
	 */
	notifyResizeListener : function () {
		var ret = true, 
			e = this.event || window.event || {};
			e.widget = this;
			e.control = this;

		this.controlListeners.forEach(function (listener) {
			var answer;

			if (listener.controlResized) {
				answer = listener.controlResized(e);
				if (typeof(answer) !== "undefined") {
					ret = answer;
				}
			}
		}, this);
		return ret;
	},

	/**
	 * 
	 * Prevents the browser from scrolling the window. Prevents the default when
	 * the either one of the following keys is pressed:
	 * <ul>
	 *  <li>Arrow Keys</li>
	 *  <li>Page up and down keys</li>
	 *  <li>Home Key</li>
	 *  <li>End Key</li>
	 *  <li>Spacebar</li>
	 * </ul>
	 *
	 * @private
	 */
	preventScrolling : function (e) {
		if (e.keyCode === gara.ARROW_UP || e.keyCode === gara.ARROW_DOWN
				|| e.keyCode === gara.ARROW_LEFT || e.keyCode === gara.ARROW_RIGHT
				|| e.keyCode === gara.PAGE_UP || e.keyCode === gara.PAGE_DOWN
				|| e.keyCode === gara.HOME || e.keyCode === gara.END
				|| e.keyCode === gara.SPACE) {
			//  || (e.keyCode === 65 && e.ctrlKey) ctrl + a
			e.preventDefault();
		}
	},

	/**
	 * Removes the listener from the collection of listeners who will be notified
	 * when the control is moved or resized.
	 *
	 * @param {gara.events.ControlListener} listener the listener which should no longer be notified
	 * @returns {gara.widgets.Control} this
	 */
	removeControlListener : function (listener) {
		this.checkWidget();
		this.controlListeners.remove(listener);
		return this;
	},
	
	/**
	 * Removes the listener from the collection of listeners who will be notified 
	 * when the control gains or loses focus.
	 *
	 * @param {gara.events.FocusListener} listener the listener which should no longer be notified
	 * @returns {gara.widgets.Control} this
	 */
	removeFocusListener : function (listener) {
		this.checkWidget();
		this.focusListeners.remove(listener);
		return this;
	},

	/**
	 * Removes the listener from the collection of listeners who will be notified 
	 * when keys are pressed and released on the system keyboard. 
	 *
	 * @param {gara.events.KeyListener} listener the listener which should be notified
	 * @returns {gara.widgets.Control} this
	 */
	removeKeyListener : function (listener) {
		this.checkWidget();
		this.keyListeners.remove(listener);
		return this;
	},

	/**
	 * Removes the listener from the collection of listeners who will be notified 
	 * when mouse buttons are pressed and released. 
	 *
	 * @param {gara.events.MouseListener} listener the listener which should be notified
	 * @returns {gara.widgets.Control} this
	 */
	removeMouseListener : function (listener) {
		this.checkWidget();
		this.mouseListeners.remove(listener);
		return this;
	},
	
	/**
	 * Removes the listener from the collection of listeners who will be notified
	 * when the mouse moves. 
	 *
	 * @param {gara.events.MouseMoveListener} listener the listener which should be notified
	 * @returns {gara.widgets.Control} this
	 */
	removeMouseMoveListener : function (listener) {
		this.checkWidget();
		this.mouseMoveListeners.remove(listener);
		return this;
	},
	
	/**
	 * Removes the listener from the collection of listeners who will be notified 
	 * when the mouse passes or hovers over controls. 
	 *
	 * @param {gara.events.MouseTrackListener} listener the listener which should be notified
	 * @returns {gara.widgets.Control} this
	 */
	removeMouseTrackListener : function (listener) {
		this.checkWidget();
		this.mouseTrackListeners.remove(listener);
		return this;
	},
	
	/**
	 * Removes the listener from the collection of listeners who will be notified 
	 * when the mouse wheel is scrolled. 
	 *
	 * @param {gara.events.MouseWheelListener} listener the listener which should be notified
	 * @returns {gara.widgets.Control} this
	 */
	removeMouseWheelListener : function (listener) {
		this.checkWidget();
		this.mouseWheelListeners.remove(listener);
		return this;
	},

	/**
	 * Sets the receiver's enabled state.
	 *
	 * @param {boolean} enabled true for enabled and false for disabled state
	 * @returns {gara.widgets.Control} this
	 */
	setEnabled : function (enabled) {
		this.enabled = enabled;
		this.handle.setAttribute("aria-disabled", !this.enabled);
		this.handle.tabIndex = this.enabled ? 0 : -1;
		return this;
	},
	
	/**
	 * Tries to set focus on the receiver.
	 * 
	 * @returns {gara.widgets.Control} this
	 */
	setFocus : function () {
		this.handle.focus();
		return this;
	},

	/**
	 * Sets the receiver's height.
	 *
	 * @param {mixed} height the new height <ul>
	 *  <li>height > 1: height in pixels</li>
	 *  <li>height = [0; 1]: height in percent</li>
	 *  <li>height = null: height is auto</li>
	 * </ul>
	 * @returns {gara.widgets.Control} this
	 */
	setHeight : function (height) {
		this.height = height;
		this.adjustHeight(height);
		
		if (height === null && this.parent instanceof gara.widgets.Composite) {
			this.parent.layout();			
		}
		
		this.controlListeners.forEach(function (listener) {
			if (listener.controlResized) {
				listener.controlResized({widget:this});
			}
		}, this);

		return this;
	},

	/**
	 * Sets the receiver's location.
	 * 
	 * @param {int} x the new left offset
	 * @param {int} y the new top offset
	 * @returns {gara.widgets.Control} this
	 */
	setLocation : function (x, y) {
		if (x >= 0) {
			this.x = x;
			this.handle.style.left = (x - this.positionOffsetX) + "px";
		}

		if (y >= 0) {
			this.y = y;
			this.handle.style.top = (y - this.positionOffsetY) + "px";
		}
		
		this.controlListeners.forEach(function (listener) {
			if (listener.controlMoved) {
				listener.controlMoved({widget:this});
			}
		}, this);

		return this;
	},

	/**
	 * Set a <code>Menu</code> for the receiver.
	 *
	 * @param {gara.widget.Menu} menu the new <code>Menu</code>
	 * @throws {TypeError} if the menu is not instance of <code>gara.widgets.Menu</code>
	 * @returns {gara.widgets.Control} this
	 */
	setMenu : function (menu) {
		if (menu !== null && !(menu instanceof gara.widgets.Menu)) {
			throw new TypeError("menu is not a gara.widgets.Menu");
		}

		// remove menu
		if (this.menu && menu === null) {
			this.removeListener("contextmenu", this);
			this.removeListener("mousedown", this);
			gara.removeEventListener(document, "mousemove", this);

			this.handle.setAttribute("aria-haspopup", false);
			this.handle.removeAttribute("aria-owns");
		}

		// set menu
		else {
			this.addListener("contextmenu", this);
			this.addListener("mousedown", this);
			gara.addEventListener(document, "mousemove", this);

			this.handle.setAttribute("aria-haspopup", true);
			this.handle.setAttribute("aria-owns", menu.getId());
		}
		this.menu = menu;
		return this;
	},
	
	/**
	 * Sets the receiver's size. Either the x and y parameters or the object is passed.
	 * 
	 * @param {int} x the new width
	 * @param {int} y the new height
	 * @param {Object} obj an object containing the new size obj.x and obj.y
	 * @returns {gara.widgets.Control} this
	 */
	setSize : function () {
		if (arguments.length === 2) {
			this.setWidth(arguments[0]);
			this.setHeight(arguments[1]);
		} else {
			this.setWidth(arguments[0].x);
			this.setHeight(arguments[0].y);
		}
		
		return this;
	},

	/**
	 * Sets the receiver's visibility.
	 * 
	 * @param {boolean} visible <code>true</code> for visible or <code>false</code> for invisible
	 * @returns {gara.widgets.Control} this
	 */
	setVisible : function (visible) {
		this.visible = visible;
		this.handle.style.display = visible ? "block" : "none";
	},

	/**
	 * Sets the receiver's width.
	 *
	 * @param {mixed} width the new width <ul>
	 *  <li>width > 1: width in pixels</li>
	 *  <li>width = [0; 1]: width in percent</li>
	 *  <li>else: width is auto</li>
	 * </ul>
	 * @returns {gara.widgets.Control} this
	 */
	setWidth : function (width) {
		this.width = width;
		this.adjustWidth(width);
		
		if (width === null && this.parent instanceof gara.widgets.Composite) {
			this.parent.layout();			
		}
		
		this.controlListeners.forEach(function (listener) {
			if (listener.controlResized) {
				listener.controlResized({widget:this});
			}
		}, this);

		return this;
	},

	/**
	 * Returns the top handle.
	 *
	 * @private
	 * @returns {HTMLElement}
	 */
	topHandle : function () {
		return this.handle;
	},

	/**
	 * Updates outstanding changes in the receiver. E.g. Does some outstanding paint processes or
	 * remeasures the boundaries
	 *
	 * @returns {void}
	 */
	update : function () {
//		alert("Control.update() invoked on " + this + ". Method not implemented");
	}
};});