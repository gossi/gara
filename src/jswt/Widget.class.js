/*	$Id$

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

/**
 * @function
 * 
 * @private
 */
function strReplace(string, search, replace) {
	output = "" + string;
	while( output.indexOf(search) > -1 ) {
		pos = output.indexOf(search);
		output = "" + (output.substring(0, pos) + replace +
			output.substring((pos + search.length), output.length));
	}
	return output;
}


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
$class("Widget", {
	/**
	 * @field
	 * contains the DOM reference of the widget
	 * 
	 * @type HTMLElement
	 */
	domref : null,

	/**
	 * @method
	 * @private
	 */
	$constructor : function(parent, style) {
		this.domref = null;

		this._parent = parent;
		this._style = typeof(style) == "undefined" ? JSWT.DEFAULT : style;
		
		this._className = "";
		this._baseClass = "";
		this._listener = {};
	},

	/**
	 * @method
	 * Adds a CSS class to the item
	 * 
	 * @author Thomas Gossmann
	 * @param {String} className new class
	 * @returns {void}
	 */
	addClassName : function(className) {
		this._className += " " + className;
		this._changed = true;
	},

	/**
	 * @method
	 * Adds an eventlistener to the widget
	 * 
	 * @author Thomas Gossmann
	 * @param {String} eventType the type of the event
	 * @param {Object} listener the listener
	 * @returns {void}
	 */
	addListener : function(eventType, listener) {
		if (!this._listener.hasOwnProperty(eventType)) {
			this._listener[eventType] = new Array();
		}

		this._listener[eventType].push(listener);
		this.registerListener(eventType, listener);
	},

	/**
	 * @method
	 * Returns the CSS class names
	 * 
	 * @author Thomas Gossmann
	 * @returns {String} the class name(s)
	 */
	getClassName : function() {
		return this._className;
	},

	/**
	 * @method
	 * Returns the style for this widget
	 * 
	 * @author Thomas Gossmann
	 * @returns {int} the style 
	 */
	getStyle : function() {
		return this._style;
	},

	/**
	 * @method
	 * Tests if there is a specified classname existent
	 * 
	 * @author Thomas Gossmann
	 * @param {String} the class name to look for
	 * @returns {boolean} wether there is this class or not
	 */
	hasClassName : function(className) {
		return this._className.indexOf(className) != -1;
	},

//	handleEvent : $abstract(function(e){}),

	/**
	 * @method
	 * Workaround for passing keyboard events to the widget with focus
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {Event} e the event
	 * @param {gara.jswt.Widget} obj the obj on which the event belongs to
	 * @param {gara.jswt.Control} control the control to witch the event belongs
	 * @returns {void}
	 */
	_notifyExternalKeyboardListener : function(e, obj, control) {
		if (this._listener.hasOwnProperty(e.type)) {
			var keydownListener = this._listener[e.type];
			
			keydownListener.forEach(function(item, index, arr) {
				e.target.obj = obj;
				e.target.control = control;

				if (typeof(item) == "object" && item.handleEvent) {
					item.handleEvent(e);
				} else if (typeof(item) == "function") {
					eval(item + "()");
				}
			});
		}
	},

	registerListener : $abstract(function(eventType, listener){}),

	/**
	 * @method
	 * Removes a CSS class name from this item.
	 * 
	 * @author Thomas Gossmann
	 * @param {String} className the class name that should be removed
	 * @returns {void}
	 */
	removeClassName : function(className) {
		this._className = strReplace(this._className, className, "");
		this._changed = true;
	},

	/**
	 * @method
	 * Removes a listener from this item
	 * 
	 * @author Thomas Gossmann
	 * @param {String} eventType the type of the event
	 * @param {Object} listener the listener
	 * @returns {void}
	 */
	removeListener : function(eventType, listener) {
		this._listener[eventType].remove(listener);
	},
	
	toString : function() {
		return "[gara.jswt.Widget]";
	}
});