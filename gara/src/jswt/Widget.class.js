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
 * @see <span style="color: #f00">blubb</span>
 */
$class("Widget", {
	/**
	 * @field
	 * contains the DOM reference of the widget
	 * 
	 * @type HTMLElement
	 */
	domref : null,

	$constructor : function() {
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
	
	handleEvent : $abstract(function(e){}),
	
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

	/**
	 * @method
	 * Sets the class name for the item
	 * 
	 * @author Thomas Gossmann
	 * @param {String} className the new class name
	 * @returns {void}
	 */
	setClassName : function(className) {
		this._className = className;
		this._changed = true;
	}
});