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

		// dom references
		this._span = null;
		this._spanText = null;
		this._img = null;
		this._checkbox = null;

		this._selected = false;
		this._grayed = false;
		this._checked = false;
	},

	/**
	 * @method
	 * Internal creation process of this item
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_create : function() {
		this.domref = document.createElement("li");
		this.domref.className = this._className;
		this.domref.obj = this;
		this.domref.control = this._list;

		this._checkbox = document.createElement("input");
		this._checkbox.type = "checkbox";
		this._checkbox.obj = this;
		this._checkbox.control = this._list;
		this._checkbox.style.display = "none";
		if (this._grayed) {
			this._checkbox.disabled = true;
		}
		if (this._checked) {
			this._checkbox.checked = true;
		}
		if ((this._list.getStyle() & JSWT.CHECK) == JSWT.CHECK) {
			this._checkbox.style.display = "inline";
		}
		
		this.domref.appendChild(this._checkbox);

		// create item nodes
		this._img = null;

		// set image
		if (this._image != null) {
			this._img = document.createElement("img");
			this._img.obj = this;
			this._img.control = this._list;
			this._img.src = this._image.src;

			// put the image into the dom
			this.domref.appendChild(this._img);
			base2.DOM.EventTarget(this._img);
		}

		this._spanText = document.createTextNode(this._text);
		
		this._span = document.createElement("span");
		this._span.obj = this;
		this._span.control = this._list;
		this._span.appendChild(this._spanText);
		this.domref.appendChild(this._span);
		
		base2.DOM.EventTarget(this.domref);
		base2.DOM.EventTarget(this._checkbox);
		base2.DOM.EventTarget(this._span);
		
		gara.EventManager.addListener(this._checkbox, "mousedown", this);
		gara.EventManager.addListener(this._checkbox, "keydown", this);

		// register listener
		for (var eventType in this._listener) {
			this._listener[eventType].forEach(function(elem, index, arr) {
				this._registerListener(eventType, elem);
			}, this);
		}
		
		var items = this._list.getItems();
		var index = items.indexOf(this);
		var nextNode = index == 0 
			? this._parentNode.firstChild
			: items[index - 1].domref.nextSibling;

		if (!nextNode) {
			this._parentNode.appendChild(this.domref);					
		} else {
			this._parentNode.insertBefore(this.domref, nextNode);
		}
	},
	
	dispose : function() {
		this.$base();

		if (this._img != null) {
			this.domref.removeChild(this._img);
			delete this._img;
			this._image = null;
		}

		this.domref.removeChild(this._span);

		if (this._parentNode != null) {
			this._parentNode.removeChild(this.domref);
		}

		delete this._span;
		delete this.domref;
	},

	getChecked : function() {
		this.checkWidget();
		this._checked = this._checkbox.checked;
		return this._checked;
	},

	getGrayed : function() {
		this.checkWidget();
		return this._grayed;
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
		this.checkWidget();
		
		if (e.target == this._checkbox
				&& (e.type == "mousedown"
					|| e.type == "keydown" && e.keyCode == 32)) {
			e.garaDetail = gara.jswt.JSWT.CHECK;
		}

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
	_registerListener : function(eventType, listener) {
		if (this._img != null) {
			gara.EventManager.addListener(this._img, eventType, listener);
		}

		if (this._span != null) {
			gara.EventManager.addListener(this._span, eventType, listener);
		}
	},
	
	setChecked : function(checked) {
		if (!this._grayed) {
			this._checked = checked;
			if (this._checked) {
				this._checkbox.checked = true;
			} else {
				this._checkbox.checked = false;
			}
		}
	},
	
	setGrayed : function(grayed) {
		this._grayed = grayed;
		if (this._grayed) {
			this._checkbox.disabled = true;
		} else {
			this._checkbox.disabled = false;
		}
	},
	
	_setSelected : function(selected) {
		this.checkWidget();
		this._selected = selected;
	},
	
	toString : function() {
		return "[gara.jswt.ListItem]";
	},
	
	/**
	 * @method
	 * Unregister listeners for this widget. Implementation for gara.jswt.Widget
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_unregisterListener : function(eventType, listener) {
		if (this._img != null) {
			gara.EventManager.removeListener(this._img, eventType, listener);
		}

		if (this._span != null) {
			gara.EventManager.removeListener(this._span, eventType, listener);
		}
	},

	/**
	 * @method
	 * Updates the list item
	 * 
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	update : function() {
		this.checkWidget();
		
		if (this.domref == null) {
			this._create();
		} else {
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
					this._listener[eventType].forEach(function(elem, index, arr){
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
					this._listener[eventType].forEach(function(elem, index, arr){
						gara.EventManager.removeListener(this._img, eventType, elem);
					}, this);
				}
			}
			
			if ((this._list.getStyle() & JSWT.CHECK) == JSWT.CHECK) {
				this._checkbox.style.display = "inline";
			} else {
				this._checkbox.style.display = "none";
			}
			
			this._spanText.nodeValue = this._text;
		}
		
		this.removeClassName("selected");

		if (this._selected) {
			this.addClassName("selected");
		}		
		this.domref.className = this._className;
		this.releaseChange();
	}
});