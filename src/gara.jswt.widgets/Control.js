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

gara.use("gara.jswt.widgets.Item");
gara.use("gara.jswt.widgets.Composite");
gara.use("gara.jswt.widgets.Menu");
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

		if (this.parent !== null && this.parent instanceof gara.jswt.widgets.Composite) {
			this.parentNode = this.parent.getClientArea();
		} else if ((this.parent !== null && this.parent instanceof gara.jswt.widgets.Display) || this.parent === null) {
			this.parentNode = this.parent.getClientArea();
		} else {
			this.parentNode = this.parent;
		}
		
		this.shell = parent.getShell ? parent.getShell() : null;

		this.createWidget();
		this.display.addWidget(this);
	},

	/**
	 * @method
	 * Adds the listener to the collection of listeners who will be notified when the control 
	 * is moved or resized, by sending it one of the messages defined in the 
	 * <code>ControlListener</code> interface. 
	 *
	 * @param {gara.jswt.events.ControlListener} listener the listener which should be notified
	 * @return {void}
	 */
	addControlListener : function (listener) {
		this.checkWidget();
		if (!this.controlListeners.contains(listener)) {
			this.controlListeners.add(listener);
		}
		return this;
	},
	
	/**
	 * @method
	 * Adds the listener to the collection of listeners who will be notified
	 * when the control gains or loses focus, by sending it one of the messages
	 * defined in the <code>FocusListener</code> interface.
	 *
	 * @param {gara.jswt.events.FocusListener} listener the listener which should be notified
	 * @return {void}
	 */
	addFocusListener : function (listener) {
		this.checkWidget();
		if (!this.focusListeners.contains(listener)) {
			this.focusListeners.add(listener);
		}
		return this;
	},

	/**
	 * @method
	 * Adds the listener to the collection of listeners who will be notified
	 * when keys are pressed and released on the system keyboard, by sending
	 * it one of the messages defined in the <code>KeyListener</code> interface.
	 *
	 * @param {gara.jswt.events.KeyListener} listener the listener which should be notified
	 * @return {void}
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
	 * @method
	 * Adds the listener to the collection of listeners who will be notified
	 * when mouse buttons are pressed and released, by sending it one of the
	 * messages defined in the <code>MouseListener</code> interface.
	 *
	 * @param {gara.jswt.events.MouseListener} listener the listener which should be notified
	 * @return {void}
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
	})(),
	
	/**
	 * @method
	 * Adds the listener to the collection of listeners who will be notified 
	 * when the mouse moves, by sending it one of the messages defined in the 
	 * <code>MouseMoveListener</code> interface. 
	 *
	 * @param {gara.jswt.events.MouseMoveListener} listener the listener which should be notified
	 * @return {void}
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
	})(),
	
	/**
	 * @method
	 * Adds the listener to the collection of listeners who will be notified
	 * when the mouse passes or hovers over controls, by sending it one of the
	 * messages defined in the <code>MouseTrackListener</code> interface. 
	 *
	 * @param {gara.jswt.events.MouseTrackListener} listener the listener which should be notified
	 * @return {void}
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
	})(),

	/**
	 * @method
	 * Adds the listener to the collection of listeners who will be notified 
	 * when the mouse wheel is scrolled, by sending it one of the 
	 * messages defined in the <code>MouseWheelListener</code> interface. 
	 *
	 * @param {gara.jswt.events.MouseWheelListener} listener the listener which should be notified
	 * @return {void}
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

	destroyWidget : function () {
		this.display.removeWidget(this);
		
		if (this.parentNode != null && this.isComposite) {
			this.parentNode.removeChild(this.handle);
		}
		
		this.controlListeners = null;
		this.focusListeners = null;
		this.keyListeners = null;
		this.mouseListeners = null;
		this.mouseMoveListeners = null;
		this.mouseTrackListeners = null;
		this.mouseWheelListeners = null;

		this.shell = null;
		this.parentNode = null;
		
		this.$super();
	},

//	/**
//	 * @method
//	 * This method is invoked by the <code>FocusManager</code> when the <code>Control</code>
//	 * gains focus.
//	 *
//	 * @private
//	 * @param {Event} e
//	 * @return {void}
//	 */
//	focusGained : function (e) {
//		this.hasFocus = true;
//
//		e.widget = this;
//		e.control = this;
//
//		// notify focus listeners
//		this.focusListeners.forEach(function (listener) {
//			if (listener.focusGained) {
//				listener.focusGained(e);
//			}
//		}, this);
//	},
//
//	/**
//	 * @method
//	 * This method is invoked by the <code>FocusManager</code> when the <code>Control</code>
//	 * losts focus.
//	 *
//	 * @private
//	 * @param {Event} e
//	 * @return {void}
//	 */
//	focusLost : function (e) {
//		this.hasFocus = false;
//
//		e.widget = this;
//		e.control = this;
//
//		// notify focus listeners
//		this.focusListeners.forEach(function (listener) {
//			if (listener.focusLost) {
//				listener.focusLost(e);
//			}
//		}, this);
//	},

	/**
	 * @method
	 * Forces the <code>Control</code> to gain focus.
	 *
	 * @return {void}
	 */
	forceFocus : function () {
		this.handle.setAttribute("data-gara-forcefocus", true);
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
	
	getShell : function () {
		return this.shell;
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
			
			this.mouseMoveListeners.forEach(function (listener) {
				if (listener.mouseMove) {
					listener.mouseMove(e);
				}
			}, this);
			break;

		case "mouseover":
			if (e.target.widget === this || (e.target.widget instanceof gara.jswt.widgets.Item && e.target.control === this)) {
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
			if (typeof e.relatedTarget.widget === "undefined" || (e.relatedTarget.widget !== this 
					&& e.relatedTarget.widget instanceof gara.jswt.widgets.Item && e.relatedTarget.control !== this)) {
			
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
	 * Returns true if the <code>Control</code> has <i>keyboard-focus</i>, and false otherwise.
	 *
	 * @return {boolean} the <code>Control</code>'s focus state
	 */
	isFocusControl : function () {
		return this.display.getFocusControl() === this;
	},

	/**
	 * @method
	 * @summary
	 * Moves the receiver above the specified control in the drawing order.
	 * 
	 * @description
	 * Moves the receiver above the specified control in the drawing order. If no argument, 
	 * then the receiver is moved to the top of the drawing order. The control at the top of the 
	 * drawing order will not be covered by other controls even if they occupy intersecting areas. 
	 *
	 * @param {gara.jswt.widgets.Control} control the sibling control (optional)
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
	 * @method
	 * @summary
	 * Moves the receiver below the specified control in the drawing order.
	 * 
	 * @description
	 * Moves the receiver below the specified control in the drawing order. If no argument, 
	 * then the receiver is moved to the bottom of the drawing order. The control at the bottom of 
	 * the drawing order will be covered by all other controls which occupy intersecting areas. 
	 *
	 * @param {gara.jswt.widgets.Control} control the sibling control (optional)
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
	 * @method
	 * 
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
	 * Removes the listener from the collection of listeners who will be notified
	 * when the control is moved or resized.
	 *
	 * @param {gara.jswt.events.ControlListener} listener the listener which should no longer be notified
	 * @return {gara.jswt.widgets.Control} this
	 */
	removeControlListener : function (listener) {
		this.checkWidget();
		this.controlListeners.remove(listener);
		return this;
	},
	
	/**
	 * @method
	 * Removes the listener from the collection of listeners who will be notified 
	 * when the control gains or loses focus.
	 *
	 * @param {gara.jswt.events.FocusListener} listener the listener which should no longer be notified
	 * @return {gara.jswt.widgets.Control} this
	 */
	removeFocusListener : function (listener) {
		this.checkWidget();
		this.focusListeners.remove(listener);
		return this;
	},

	/**
	 * @method
	 * Removes the listener from the collection of listeners who will be notified 
	 * when keys are pressed and released on the system keyboard. 
	 *
	 * @param {gara.jswt.events.KeyListener} listener the listener which should be notified
	 * @return {gara.jswt.widgets.Control} this
	 */
	removeKeyListener : function (listener) {
		this.checkWidget();
		this.keyListeners.remove(listener);
		return this;
	},

	/**
	 * @method
	 * Removes the listener from the collection of listeners who will be notified 
	 * when mouse buttons are pressed and released. 
	 *
	 * @param {gara.jswt.events.MouseListener} listener the listener which should be notified
	 * @return {gara.jswt.widgets.Control} this
	 */
	removeMouseListener : function (listener) {
		this.checkWidget();
		this.mouseListeners.remove(listener);
		return this;
	},
	
	/**
	 * @method
	 * Removes the listener from the collection of listeners who will be notified
	 * when the mouse moves. 
	 *
	 * @param {gara.jswt.events.MouseMoveListener} listener the listener which should be notified
	 * @return {gara.jswt.widgets.Control} this
	 */
	removeMouseMoveListener : function (listener) {
		this.checkWidget();
		this.mouseMoveListeners.remove(listener);
		return this;
	},
	
	/**
	 * @method
	 * Removes the listener from the collection of listeners who will be notified 
	 * when the mouse passes or hovers over controls. 
	 *
	 * @param {gara.jswt.events.MouseTrackListener} listener the listener which should be notified
	 * @return {gara.jswt.widgets.Control} this
	 */
	removeMouseTrackListener : function (listener) {
		this.checkWidget();
		this.mouseTrackListeners.remove(listener);
		return this;
	},
	
	/**
	 * @method
	 * Removes the listener from the collection of listeners who will be notified 
	 * when the mouse wheel is scrolled. 
	 *
	 * @param {gara.jswt.events.MouseWheelListener} listener the listener which should be notified
	 * @return {gara.jswt.widgets.Control} this
	 */
	removeMouseWheelListener : function (listener) {
		this.checkWidget();
		this.mouseWheelListeners.remove(listener);
		return this;
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
	
	setFocus : function () {
		this.handle.focus();
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
		
		this.controlListeners.forEach(function (listener) {
			if (listener.controlResized) {
				listener.controlResized({widget:this});
			}
		}, this);

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
		
		this.controlListeners.forEach(function (listener) {
			if (listener.controlMoved) {
				listener.controlMoved({widget:this});
			}
		}, this);

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
	
	setSize : function () {
		if (arguments.length == 2) {
			this.setWidth(arguments[0]);
			this.setHeight(arguments[1]);
		} else {
			this.setWidth(arguments[0].x);
			this.setHeight(arguments[0].y);
		}
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
		
		this.controlListeners.forEach(function (listener) {
			if (listener.controlResized) {
				listener.controlResized({widget:this});
			}
		}, this);

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