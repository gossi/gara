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

gara.provide("gara.widgets.Widget");

//gara.use("gara.widgets.Display");
//gara.use("gara.widgets.WidgetException");

/**
 * Widget Super Hero!
 * 
 * @class gara.widgets.Widget
 */
gara.widgets.Widget = gara.Class(/** @lends gara.widgets.Widget# */ {

	/**
	 * @private
	 * @type Array
	 */
	classes : [],

	/**
	 * @private
	 * @type Object
	 */
	data : {},

	/**
	 * @private
	 * @type Object
	 */
	dataMap : {},

	/**
	 * @private
	 * @type gara.widgets.Display
	 */
	display : null,

	/**
	 * @private
	 * @type Array
	 */
	disposeListeners : [],

	/**
	 * @private
	 * @type Object
	 */
	event : null,

	/**
	 * contains the DOM handle of the widget
	 *
	 * @type HTMLElement
	 */
	handle : null,

	/**
	 * @private
	 * @type String
	 */
	id : "",

	/**
	 * @private
	 * @type Object
	 */
	listeners : {},

	/**
	 * @type HTMLElement|gara.widgets.Composite
	 * @private
	 */
	parent : null,

	/**
	 * @type HTMLElement|gara.widgets.Composite
	 * @private
	 */
	parentNode : null,

	/**
	 * @private
	 * @type int
	 */
	style : 0,

	/**
	 * Widget base constructor
	 *
	 * @constructs
	 * @param {gara.widgets.Widget|HTMLElement} parent the parent for this widget
	 * @param {int} style the style codec for this widget
	 */
	constructor : function (parent, style) {
		this.id = "";
		this.classes = ["gara"];

		this.handle = null;
		this.parentNode = null;

		this.parent = parent;
		this.style = style || gara.DEFAULT;
		this.disposed = false;
		this.display = parent && parent.getDisplay ? parent.getDisplay() : gara.widgets.Display.getDefault();

		this.event = null;
		this.listeners = {};
		this.disposeListeners = [];

		this.data = {};
		this.dataMap = {};
	},

	/**
	 * Adds a CSS class to the item
	 *
	 * @param {String} className new class
	 * @returns {gara.widgets.Widget}
	 */
	addClass : function (className) {
		if (!this.classes.contains(className)) {
			this.classes.push(className);
			if (this.handle !== null) {
				this.handle.className = this.classes.join(" ");
			}
		}
		return this;
	},

	/**
	 * Adds multiple CSS classes to the <code>Widget</code>
	 *
	 * @param {String[]} classNames new classes in an array
	 * @returns {gara.widgets.Widget}
	 */
	addClasses : function (classNames) {
		classNames.forEach(function (className) {
			this.addClass(className);
		}, this);
		return this;
	},

	/**
	 * Adds a dispose listener to the widget
	 *
	 * @param {gara.events.DisposeListener} listener the listener which gets notified about the disposal
	 * @returns {void}
	 */
	addDisposeListener : function (listener) {
		if (!this.disposeListeners.contains(listener)) {
			this.disposeListeners.push(listener);
		}
		return this;
	},

	/**
	 * Adds an event listener to the widget
	 *
	 * @param {String} eventType the type of the event
	 * @param {Object} listener the listener
	 * @returns {void}
	 */
	addListener : function (eventType, listener) {
		if (!Object.prototype.hasOwnProperty.call(this.listeners, eventType)) {
			this.listeners[eventType] = [];
		}

		if (!this.listeners[eventType].contains(listener)) {
			this.listeners[eventType].push(listener);
			this.bindListener(eventType, listener);
		}
		return this;
	},

	/**
	 * Binds the listener to the widgets elements. Should be implemented
	 * by the widget authors!
	 *
	 * @private
	 * @param {String} eventType the type of the event
	 * @param {Object} listener the listener
	 * @see unbindListener
	 * @returns {void}
	 */
	bindListener : function (eventType, listener) {
//		alert("Trying to bind listener on " + this + ". Method not implemented.\n" +
//				"    Type: " + eventType + "\n" +
//				"    Listener: " + listener);
	},

	/**
	 * Returns a style with exactly one style bit set out of
	 * the specified set of exclusive style bits. All other
	 * possible bits are cleared when the first matching bit
	 * is found. Bits that are not part of the possible set
	 * are untouched.
	 *
	 * @static
	 * @function
	 * @author SWT-Team
	 *
	 * @param style the original style bits
	 * @param n the nth possible style bit (n is unlimited, pass as much as you want)
	 *
	 * @returns {int} the new style bits
	 */
	checkBits : gara.$static(function () {
		var mask = 0, i, style = arguments[0];
		for (i = 1; i < arguments.length; i++) {
			mask |= arguments[i];
		}
		if (arguments.length > 1) {
			if ((style & mask) === 0){style |= arguments[1];}
			for (i = 1; i < arguments.length; i++) {
				if ((style & arguments[i]) !== 0){style = (style & ~mask) | arguments[i];}
			}
		}
		return style;
	}),

	/**
	 * Checks wether the widget is disposed or not
	 *
	 * @throws gara.WidgetException <ul>
	 *  <li>gara.gara.ERROR_WIDGET_DISPOSED - If widget is disposed</li>
	 * </ul>
	 *
	 * @returns {void}
	 */
	checkWidget : function () {
		if (this.isDisposed()) {
			throw new gara.widgets.WidgetException(gara.ERROR_WIDGET_DISPOSED);
		}
	},

	/**
	 * Disposes the widget
	 *
	 * @returns {void}
	 */
	dispose : function () {
		if (this.disposed) {
			return;
		}
		
		this.release();
	},
	
	/**
	 * Destroys the widget
	 * 
	 * @private
	 */
	destroyWidget : function () {
		this.handle = null;
		this.classes = null;
		this.parent = null;
		this.display = null;
		this.parentNode = null;
		this.listeners = null;
		this.disposeListeners = null;
		this.data = null;
		this.dataMap = null;
	},

	/**
	 * Returns application based data for this widget, or <code>null</code> if it has not been set
	 *
	 * @returns {Object} application based data
	 */
	getData : function (key) {
		if (typeof(key) === "undefined") {
			return this.data;
		} else {
			if (Object.prototype.hasOwnProperty.call(this.dataMap, key)) {
				return this.dataMap[key];
			}
		}
		return null;
	},
	
	/**
	 * Returns the Display, the receiver is attached to
	 * 
	 * @returns {gara.widgets.Display} the display
	 */
	getDisplay : function () {
		return this.display;
	},

	/**
	 * Returns the ID for this widget. This ID is also used in the DOM handle.
	 *
	 * @return {String} the ID
	 */
	getId : function () {
		if (this.id === "") {
			this.id = gara.generateUID();
		}
		return this.id;
	},

	/**
	 * Returns the receiver's parent. 
	 *
	 * @returns {gara.widgets.Widget|HTMLElement} the receiver's parent
	 */
	getParent : function () {
		return this.parent;
	},

	/**
	 * Returns the style for this widget
	 *
	 * @returns {int} the style
	 */
	getStyle : function () {
		return this.style;
	},

	/**
	 * Tests if there is a specified class available
	 *
	 * @param {String} className the class name to look for
	 * @returns {boolean} true if the class is available and false if not
	 */
	hasClass : function (className) {
		return this.classes.contains(className);
	},

	/**
	 * Tells wether this widget is disposed or not
	 *
	 * @returns {boolean} true for disposed status otherwise false
	 */
	isDisposed : function () {
		return this.disposed;
	},

	/*
	 * Workaround for passing keyboard events to the widget with focus
	 *
	 * @private
	 * @param {Event} e the event
	 * @param {gara.widgets.Widget} widget the obj on which the event belongs to
	 * @param {gara.widgets.Control} control the control to witch the event belongs
	 * @returns {void}
	 */
//	handleEvent : function(e) {
//		switch (e.type) {
//		case "keydown":
//		case "keyup":
//		case "keypress":
//			if (this.listeners.hasOwnProperty(e.type)) {
//				this.listeners[e.type].forEach(function (listener) {
//					console.log("Widget("+this+") call listener on " + e.type);
//					if (typeof(listener) == "object" && listener.handleEvent) {
//						listener.handleEvent(e);
//					} else if (typeof(listener) == "function") {
//						listener.call(window, e);
//					}
//				});
//			}
//			break;
//		}
//	},


	/**
	 * Removes a CSS class name from this item.
	 *
	 * @param {String} className the class name that should be removed
	 * @returns {void}
	 */
	removeClass : function (className) {
		this.classes.remove(className);
		if (this.handle !== null) {
			this.handle.className = this.classes.join(" ");
		}
		return this;
	},

	/**
	 * Removes a dispose listener from the widget
	 *
	 * @param {gara.events.DisposeListener} listener the listener which should be removed
	 * @returns {void}
	 */
	removeDisposeListener : function (listener) {
		this.disposeListeners.remove(listener);
		return this;
	},

	/**
	 * Removes a listener from this item
	 *
	 * @param {String} eventType the type of the event
	 * @param {Object} listener the listener
	 * @returns {void}
	 */
	removeListener : function (eventType, listener) {
		if (Object.prototype.hasOwnProperty.call(this.listeners, eventType)
				&& this.listeners[eventType].contains(listener)) {
			this.listeners[eventType].remove(listener);
			this.unbindListener(eventType, listener);
		}
		return this;
	},
	
	release : function () {
		var type, i, len;
		this.disposed = true;
		
		// remove attached listener
		for (type in this.listener) {
			if (Object.prototype.hasOwnProperty.call(this.listener, type)) {
				for (i = 0, len = this.listener[type].length; i < len; i++) {
					this.removeListener(type, this.listener[type][i]);
				}
			}
		}
		
		// notify dispose listeners
		this.disposeListeners.forEach(function (listener) {
			if (listener.widgetDisposed) {
				listener.widgetDisposed(this);
			}
		}, this);
		
		this.releaseChildren();
		this.destroyWidget();
	},
	
	/**
	 * Releases all children from the receiver
	 *
	 * @private
	 * @returns {void}
	 */
	releaseChildren : function () {},

	/**
	 * Sets a class on or off
	 *
	 * @param {String} className the class to set
	 * @param {boolean} on true for setting the class and false for removing
	 * @returns {void}
	 */
	setClass : function (className, on) {
		if (!on) {
			this.removeClass(className);
		} else {
			this.addClass(className);
		}
		return this;
	},

	/**
	 * Sets application based data for this widget
	 *
	 * @param {Object} data your data for this widget
	 * @returns {void}
	 */
	setData : function (key, data) {
		if (typeof data === "undefined") {
			this.data = key;
		} else {
			this.dataMap[key] = data;
		}
		return this;
	},

	/**
	 * Sets the ID for this widget. Even sets the ID in the DOM handle wether
	 * the widget is created
	 *
	 * @param {String} id the ID
	 * @returns {void}
	 */
	setId : function (id) {
		this.id = id;
		return this;
	},

	/**
	 * Toggles a class
	 *
	 * @param {String} className the class to toggle
	 * @returns {void}
	 */
	toggleClass : function (className) {
		if (this.classes.contains(className)) {
			this.classes.remove(className);
		} else {
			this.classes.push(className);
		}
		if (this.handle !== null) {
			this.handle.className = this.classes.join(" ");
		}
	},

	/**
	 * Unbinds listener from the widgets elements. Should be implemented
	 * by the widget authors!
	 *
	 * @private
	 * @param {String} eventType the type of the event
	 * @param {Object} listener the listener
	 * @see unbindListener
	 * @returns {void}
	 */
	unbindListener : function (eventType, listener) {
//		alert("Trying to unbind listener on " + this + ". Method not implemented.\n" +
//			"    Type: " + eventType + "\n" +
//			"    Listener: " + listener);
	}
});