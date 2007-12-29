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
 * @summary
 * gara ListItem for List Widget
 * 
 * @description
 * 
 * @class ListItem
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @extends gara.jswt.Item
 */
$class("ListItem", {
	$extends : gara.jswt.Item,

	/**
	 * @constructor
	 * Constructor
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.List} parent the List Widget for this item
	 * @param {int} style the style for this item
	 * @param {int} index index to insert the item at
	 * @throws {TypeError} if the list is not a List widget
	 * @return {gara.jswt.ListItem}
	 */
	$constructor : function(parent, style, index) {
		if (!$class.instanceOf(parent, gara.jswt.List)) {
			throw new TypeError("parent is not type of gara.jswt.List");
		}
		this.$base(parent, style);
		this._parent = parent;
		this._list = parent;
		this._list._addItem(this, index);
		this._span = null;
		this._spanText = null;
		this._img = null;
	},

	/**
	 * @method
	 * Internal creation process of this item
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	create : function() {
		this.domref = document.createElement("li");
		this.domref.className = this._className;
		this.domref.obj = this;
		this.domref.control = this._list;

		// create item nodes
		this._img = null;

		// set image
		if (this._image != null) {
			this._img = document.createElement("img");
			this._img.obj = this;
			this._img.control = this._list;
			this._img.src = this._image.src;
			this._img.alt = this._text;

			// put the image into the dom
			this.domref.appendChild(this._img);
		}

		this._spanText = document.createTextNode(this._text);
		
		this._span = document.createElement("span");
		this._span.obj = this;
		this._span.control = this._list;
		this._span.appendChild(this._spanText);
		this.domref.appendChild(this._span);
		
		base2.DOM.EventTarget(this.domref);
		base2.DOM.EventTarget(this._span);

		// register listener
		for (var eventType in this._listener) {
			this._listener[eventType].forEach(function(elem, index, arr) {
				this.registerListener(eventType, elem);
			}, this);
		}

		this._changed = false;
		return this.domref;
	},
	
	/**
	 * @method
	 * Event handler for this item. Its main use is to pass through keyboard events
	 * to all listeners.
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {Event} e DOMEvent
	 * @return {void} 
	 */
	handleEvent : function(e) {
		switch (e.type) {
			case "keyup":
			case "keydown":
			case "keypress":
				this._notifyExternalKeyboardListener(e, this, this._list);
				break;
		}
	},
	/**
	 * @method
	 * Register listeners for this widget. Implementation for gara.jswt.Widget
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	registerListener : function(eventType, listener) {
		if (this._img != null) {
			gara.EventManager.getInstance().addListener(this._img, eventType, listener);
		}

		if (this._span != null) {
			gara.EventManager.getInstance().addListener(this._span, eventType, listener);
		}
	},
	
	toString : function() {
		return "[gara.jswt.ListItem]";
	},

	/**
	 * @method
	 * Updates the list item
	 * 
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	update : function() {
		// create image
		if (this._image != null && this._img == null) {
			this._img = document.createElement("img");
			this._img.obj = this;
			this._img.control = this._list;
			this._img.alt = this._text;
			this._img.src = this._image.src;
			this.domref.insertBefore(this._img, this._span);
			base2.DOM.EventTarget(this._img);
			
			// event listener
			for (var eventType in this._listener) {
				this._listener[eventType].forEach(function(elem, index, arr) {
					this.registerListener(this._img, eventType, elem);
				}, this);
			}
		}
		

		// simply update image information
		else if (this._image != null) {
			this._img.src = this._image.src;
			this._img.alt = this._text;
		}

		// delete image
		else if (this._img != null && this._image == null) {
			this.domref.removeChild(this._img);
			this._img = null;

			// event listener
			for (var eventType in this._listener) {
				this._listener[eventType].forEach(function(elem, index, arr) {
					gara.EventManager.getInstance().removeListener({
						domNode : this._img,
						type: eventType, 
						listener : elem
					});
				}, this);
			}
		}

		this._spanText.nodeValue = this._text;
		this.domref.className = this._className;
	}
});