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
 * long description
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
	$constructor : function() {
		this.domref = null;
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
	 * @type void
	 */
	addClassName : function(className) {
		this._className += " " + className;
		this._changed = true;
	},

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
	
	hasClassName : function(className) {
		return this._className.indexOf(className) != -1;
	},
	
//	handleEvent : $abstract(function(e){}),
	
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
	
	removeListener : function(eventType, listener) {
		this._listener[eventType].remove(listener);
	},
	
	toString : function() {
		return "[gara.jswt.Widget]";
	}
});