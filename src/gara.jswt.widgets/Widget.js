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
gara.use("gara.jswt.events.DisposeListener");

gara.require("gara.jswt.JSWT");

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
	 * contains the DOM handle of the widget
	 *
	 * @type HTMLElement
	 */
	handle : null,

	/**
	 * @constructor
	 * Widget base constructor
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.Widget|HTMLElement} parent the parent for this widget
	 * @param {int} style the style codec for this widget
	 */
	$constructor : function(parent, style) {
		this.handle = null;

		this._parent = parent;
		this._parentNode = null;
		this._style = typeof(style) == "undefined" ? gara.jswt.JSWT.DEFAULT : style;
		this._event = null;
		this._data = null;
		this._dataMap = {};
		this._id = null;

		this._listener = {};

		this._disposed = false;
		this._disposeListener = [];

		// css
		this._classes = ["gara"];
		this._baseClass = "";
	},

	/**
	 * @method
	 * Adds a CSS class to the item
	 *
	 * @author Thomas Gossmann
	 * @param {String} className new class
	 * @return {void}
	 */
	addClass : function(className) {
		if (!this._classes.contains(className)) {
			this._classes.push(className);
			if (this.handle != null) {
				this.handle.className = this._classes.join(" ");
			}
		}
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
	addDisposeListener : function(listener) {
		if (!gara.instanceOf(listener, gara.jswt.events.DisposeListener)) {
			throw new TypeError("listener not instance of gara.jswt.events.DisposeListener");
		}

		if (!this._disposeListener.contains(listener)) {
			this._disposeListener.push(listener);
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
	addListener : function(eventType, listener) {
		if (!this._listener.hasOwnProperty(eventType)) {
			this._listener[eventType] = [];
		}

		if (!this._listener[eventType].contains(listener)) {
			this._listener[eventType].push(listener);
			this._registerListener(eventType, listener);
		}
		return this;
	},

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
	checkWidget : function() {
		if (this.isDisposed()) {
			throw new gara.jswt.gara.jswt.JSWTException(gara.jswt.JSWT.ERROR_WIDGET_DISPOSED);
		}
	},

	/**
	 * @method
	 * Disposes the widget
	 *
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	dispose : function() {
		this._disposed = true;

		// notify dispose listeners
		this._disposeListener.forEach(function(item, index, arr) {
			item.widgetDisposed(this);
		}, this);

		for (var type in this._listener) {
			this._listener[type].forEach(function(item, index, arr) {
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
	getData : function(key) {
		if (typeof(key) == "undefined") {
			return this._data;
		} else {
			if (this._dataMap.hasOwnProperty(key)) {
				return this._dataMap[key];
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
	getId : function() {
		if (this._id == null) {
			var d = new Date();
			this._id = "garaID" + d.getDay() + d.getHours() + d.getMinutes() + d.getSeconds() + d.getMilliseconds();
		}
		return this._id;
	},

	/**
	 * @method
	 * Returns the parent for this widget
	 *
	 * @author Thomas Gossmann
	 * @return {gara.jswt.Widget|HTMLElement} the widgets parent
	 */
	getParent : function() {
		return this._parent;
	},

	/**
	 * @method
	 * Returns the style for this widget
	 *
	 * @author Thomas Gossmann
	 * @return {int} the style
	 */
	getStyle : function() {
		return this._style;
	},

	/**
	 * @method
	 * Tests if there is a specified class available
	 *
	 * @author Thomas Gossmann
	 * @param {String} className the class name to look for
	 * @return {boolean} true if the class is available and false if not
	 */
	hasClass : function(className) {
		return this._classes.contains(className);
	},

//	handleEvent : gara.abstract(function(e){}),

	/**
	 * @method
	 * Tells wether this widget is disposed or not
	 *
	 * @author Thomas Gossmann
	 * @return {boolean} true for disposed status otherwise false
	 */
	isDisposed : function() {
		return this._disposed;
	},


	/**
	 * @method
	 * Workaround for passing keyboard events to the widget with focus
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @param {Event} e the event
	 * @param {gara.jswt.widgets.Widget} widget the obj on which the event belongs to
	 * @param {gara.jswt.widgets.Control} control the control to witch the event belongs
	 * @return {void}
	 */
	_notifyExternalKeyboardListener : function(e, widget, control) {
		if (this._listener.hasOwnProperty(e.type)) {
			var keydownListener = this._listener[e.type];

			keydownListener.forEach(function(item, index, arr) {
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

	_registerListener : gara.abstract(function(eventType, listener){}),

	/**
	 * @method
	 * Removes a CSS class name from this item.
	 *
	 * @author Thomas Gossmann
	 * @param {String} className the class name that should be removed
	 * @return {void}
	 */
	removeClass : function(className) {
		this._classes.remove(className);
		if (this.handle != null) {
			this.handle.className = this._classes.join(" ");
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
	removeDisposeListener : function(listener) {
		if (!gara.instanceOf(listener, gara.jswt.events.DisposeListener)) {
			throw new TypeError("listener not instance of gara.jswt.events.DisposeListener");
		}

		if (this._disposeListener.contains(listener)) {
			this._disposeListener.remove(listener);
		}
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
	removeListener : function(eventType, listener) {
		if (this._listener.hasOwnProperty(eventType)
				&& this._listener[eventType].contains(listener)) {
			this._listener[eventType].remove(listener);
			this._unregisterListener(eventType, listener);
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
	setClass : function(className, on) {
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
	setData : function(key, data) {
		if (typeof(data) == "undefined") {
			this._data = key;
		} else {
			this._dataMap[key] = data;
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
	setId : function(id) {
		this._id = id;
		return this;
	},

	_setParentNode : function(parentNode) {
		this._parentNode = parentNode;
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
	toggleClass : function(className) {
		if (this._classes.contains(className)) {
			this._classes.remove(className);
		} else {
			this._classes.push(className);
		}
		if (this.handle != null) {
			this.handle.className = this._classes.join(" ");
		}
	},

	_unregisterListener : gara.abstract(function(eventType, listener){})
});