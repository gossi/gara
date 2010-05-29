/*	$Id: Widget.class.js 169 2008-11-13 23:29:49Z tgossmann $

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

gara.provide("gara.jswt.widgets.Widget");

gara.use("gara.EventManager");
gara.use("gara.jswt.JSWTException");
gara.use("gara.jswt.JSWT");
gara.use("gara.jswt.widgets.Display");

/**
 * @class Widget
 *
 * @summary
 * short description
 *
 * @description
 * long description (just testing the doc...)
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @see http://gara.creative2.net
 * @see gara.jswt.List
 * @see <span style="color: #f00">doc-test... am i red?</span>
 */
gara.Class("gara.jswt.widgets.Widget", {

	/**
	 * @field
	 *
	 * @private
	 * @type Array
	 */
	classes : [],

	/**
	 * @field
	 *
	 * @private
	 * @type Object
	 */
	data : {},

	/**
	 * @field
	 *
	 * @private
	 * @type Object
	 */
	dataMap : {},

	/**
	 * @field
	 *
	 * @private
	 * @type gara.jswt.widgets.Display
	 */
	display : null,

	/**
	 * @field
	 *
	 * @private
	 * @type boolean
	 */
	disposed : false,

	/**
	 * @field
	 *
	 * @private
	 * @type Array
	 */
	disposeListener : [],

	/**
	 * @field
	 *
	 * @private
	 * @type Object
	 */
	event : null,

	/**
	 * @field
	 * contains the DOM handle of the widget
	 *
	 * @type HTMLElement
	 */
	handle : null,

	/**
	 * @field
	 *
	 * @private
	 * @type String
	 */
	id : "",

	/**
	 * @field
	 *
	 * @private
	 * @type Object
	 */
	listeners : {},

	/**
	 * @field
	 *
	 * @type HTMLElement|gara.jswt.widgets.Composite
	 * @private
	 */
	parent : null,

	/**
	 * @field
	 *
	 * @type HTMLElement|gara.jswt.widgets.Composite
	 * @private
	 */
	parentNode : null,

	/**
	 * @field
	 *
	 * @private
	 * @type int
	 */
	style : 0,

	/**
	 * @constructor
	 * Widget base constructor
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.Widget|HTMLElement} parent the parent for this widget
	 * @param {int} style the style codec for this widget
	 */
	$constructor : function (parent, style) {
		this.id = "";
		this.classes = ["gara"];

		this.handle = null;
		this.parentNode = null;

		this.parent = parent;
		this.style = style || gara.jswt.JSWT.DEFAULT;
		this.disposed = false;
		this.display = parent && parent.getDisplay ? parent.getDisplay() : gara.jswt.widgets.Display.getDefault();

		this.event = null;
		this.listeners = {};
		this.disposedListeners = {};

		this.data = {};
		this.dataMap = {};


	},

	/**
	 * @method
	 * Adds a CSS class to the item
	 *
	 * @author Thomas Gossmann
	 * @param {String} className new class
	 * @return {gara.jswt.widgets.Widget}
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
	 * @method
	 * Adds multiple CSS classes to the <code>Widget</code>
	 *
	 * @author Thomas Gossmann
	 * @param {String[]} classNames new classes in an array
	 * @return {gara.jswt.widgets.Widget}
	 */
	addClasses : function (classNames) {
		classNames.forEach(function (className) {
			this.addClass(className);
		}, this);
		return this;
	},

	/**
	 * @method
	 * Adds a dispose listener to the widget
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.DisposeListener} listener the listener which gets notified about the disposal
	 * @return {void}
	 */
	addDisposeListener : function (listener) {
		if (!this.disposeListener.contains(listener)) {
			this.disposeListener.push(listener);
		}
		return this;
	},

	/**
	 * @method
	 * Adds an event listener to the widget
	 *
	 * @author Thomas Gossmann
	 * @param {String} eventType the type of the event
	 * @param {Object} listener the listener
	 * @return {void}
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
	 * @method
	 * Binds the listener to the widgets elements. Should be implemented
	 * by the widget authors!
	 *
	 * @private
	 * @param {String} eventType the type of the event
	 * @param {Object} listener the listener
	 * @see unbindListener
	 * @return {void}
	 */
	bindListener : function (eventType, listener) {
		alert("Trying to bind listener on " + this + ". Method not implemented.\n" +
				"    Type: " + eventType + "\n" +
				"    Listener: " + listener);
	},

	/**
	 * @method
	 * Returns a style with exactly one style bit set out of
	 * the specified set of exclusive style bits. All other
	 * possible bits are cleared when the first matching bit
	 * is found. Bits that are not part of the possible set
	 * are untouched.
	 *
	 * @author SWT-Team
	 *
	 * @param style the original style bits
	 * @param n the nth possible style bit (n is unlimited, pass as much as you want)
	 *
	 * @return the new style bits
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
	 * @method
	 * Checks wether the widget is disposed or not
	 *
	 * @author Thomas Gossmann
	 * @throws gara.jswt.gara.jswt.JSWTException <ul>
	 * 		<li>gara.jswt.gara.jswt.JSWT.ERROR_WIDGET_DISPOSED - If widget is disposed</li>
	 * </ul>
	 *
	 * @return {void}
	 */
	checkWidget : function () {
		if (this.isDisposed()) {
			throw new gara.jswt.JSWTException(gara.jswt.JSWT.ERROR_WIDGET_DISPOSED);
		}
	},

	/**
	 * @method
	 * Disposes the widget
	 *
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	dispose : function () {
		this.disposed = true;

		// notify dispose listeners
		this.disposeListener.forEach(function (item, index, arr) {
			// interface checking
			if (item.widgetDisposed) {
				item.widgetDisposed(this);
			}
		}, this);

		for (var type in this.listener) {
			this.listener[type].forEach(function (item, index, arr) {
				this.removeListener(type, item);
			}, this);
		}
	},

	/**
	 * @method
	 * Returns application based data for this widget, or <code>null</code> if it has not been set
	 *
	 * @author Thomas Gossmann
	 * @return {Object} application based data
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
	 * @method
	 * Returns the ID for this widget. This ID is also used in the DOM handle.
	 *
	 * @author Thomas Gossmann
	 * @return {String} the ID
	 */
	getId : function () {
		if (this.id === "") {
			this.id = gara.generateUID();
		}
		return this.id;
	},

	/**
	 * @method
	 * Returns the parent for this widget
	 *
	 * @author Thomas Gossmann
	 * @return {gara.jswt.Widget|HTMLElement} the widgets parent
	 */
	getParent : function () {
		return this.parent;
	},

	/**
	 * @method
	 * Returns the style for this widget
	 *
	 * @author Thomas Gossmann
	 * @return {int} the style
	 */
	getStyle : function () {
		return this.style;
	},

	/**
	 * @method
	 * Tests if there is a specified class available
	 *
	 * @author Thomas Gossmann
	 * @param {String} className the class name to look for
	 * @return {boolean} true if the class is available and false if not
	 */
	hasClass : function (className) {
		return this.classes.contains(className);
	},

	/**
	 * @method
	 * Tells wether this widget is disposed or not
	 *
	 * @author Thomas Gossmann
	 * @return {boolean} true for disposed status otherwise false
	 */
	isDisposed : function () {
		return this.disposed;
	},

	/**
	 * @method
	 * Workaround for passing keyboard events to the widget with focus
	 *
	 * @private
	 * @param {Event} e the event
	 * @param {gara.jswt.widgets.Widget} widget the obj on which the event belongs to
	 * @param {gara.jswt.widgets.Control} control the control to witch the event belongs
	 * @return {void}
	 */
	notifyExternalKeyboardListener : function(e, widget, control) {
		if (this.listeners.hasOwnProperty(e.type)) {
			this.listeners[e.type].forEach(function (item, index, arr) {
				e.target.widget = widget;
				e.target.control = control;

				if (typeof(item) == "object" && item.handleEvent) {
					item.handleEvent(e);
				} else if (typeof(item) == "function") {
					eval(item + "()");
				}
			});
		}
	},


	/**
	 * @method
	 * Removes a CSS class name from this item.
	 *
	 * @author Thomas Gossmann
	 * @param {String} className the class name that should be removed
	 * @return {void}
	 */
	removeClass : function (className) {
		this.classes.remove(className);
		if (this.handle !== null) {
			this.handle.className = this.classes.join(" ");
		}
		return this;
	},

	/**
	 * @method
	 * Removes a dispose listener from the widget
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.DisposeListener} listener the listener which should be removed
	 * @return {void}
	 */
	removeDisposeListener : function (listener) {
		this.disposeListener.remove(listener);
		return this;
	},

	/**
	 * @method
	 * Removes a listener from this item
	 *
	 * @author Thomas Gossmann
	 * @param {String} eventType the type of the event
	 * @param {Object} listener the listener
	 * @return {void}
	 */
	removeListener : function (eventType, listener) {
		if (Object.prototype.hasOwnProperty.call(this.listeners, eventType)
				&& this.listeners[eventType].contains(listener)) {
			this.listeners[eventType].remove(listener);
			this.unbindListener(eventType, listener);
		}
		return this;
	},

	/**
	 * @method
	 * Sets a class on or off
	 *
	 * @author Thomas Gossmann
	 * @param {String} className the class to set
	 * @param {boolean} on true for setting the class and false for removing
	 * @return {void}
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
	 * @method
	 * Sets application based data for this widget
	 *
	 * @author Thomas Gossmann
	 * @param {Object} data your data for this widget
	 * @return {void}
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
	 * @method
	 * Sets the ID for this widget. Even sets the ID in the DOM handle wether
	 * the widget is created
	 *
	 * @author Thomas Gossmann
	 * @param {String} id the ID
	 * @return {void}
	 */
	setId : function (id) {
		this.id = id;
		return this;
	},

	/**
	 * @method
	 * Toggles a class
	 *
	 * @author Thomas Gossmann
	 * @param {String} className the class to toggle
	 * @return {void}
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
	 * @method
	 * Unbinds listener from the widgets elements. Should be implemented
	 * by the widget authors!
	 *
	 * @private
	 * @param {String} eventType the type of the event
	 * @param {Object} listener the listener
	 * @see unbindListener
	 * @return {void}
	 */
	unbindListener : function (eventType, listener) {
		alert("Trying to unbind listener on " + this + ". Method not implemented.\n" +
			"    Type: " + eventType + "\n" +
			"    Listener: " + listener);
	}
});