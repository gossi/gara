/*	$Id: List.class.js 114 2007-12-27 20:41:27Z tgossmann $

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
 * gara Menu Widget
 * 
 * @description
 * long description for the Menu Widget...
 * 
 * @class Menu
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @extends gara.jswt.Widget
 */
$class("Menu", {
	$extends : gara.jswt.Widget,
	
	$constructor : function(parent, style) {
		this.$base(parent, style);

		// Menu default style
		if ((this._style & JSWT.DEFAULT) == JSWT.DEFAULT) {
			this._style = JSWT.BAR;
		}

		if ($class.instanceOf(parent, gara.jswt.Control)) {
			this._style = JSWT.POP_UP;
		}
		
		if ($class.instanceOf(parent, gara.jswt.MenuItem) 
				&& (parent.getStyle() & JSWT.CASCADE) != JSWT.CASCADE) {
			throw new Exception("parent has no JSWT.CASCADE style!");
		}
		
		if ($class.instanceOf(parent, gara.jswt.MenuItem)) {
			this._style = JSWT.DROP_DOWN;
		}
		
		this._items = [];

		// location
		this._x = 0;
		this._y = 0;

		// flags
		this._enabled = false;
		this._visible = true;
		this._visibleEvent = null;
		
		this._className = this._baseClass = "jsWTMenu";

		//window.oncontextmenu = function() {return false;};
	},

	_addItem : function(item, index) {
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.MenuItem)) {
			throw new TypeError("item is not instance of gara.jswt.MenuItem");
		}

		if (typeof(index) != "undefined") {
			this._items.insertAt(index, item);
		} else {
			this._items.push(item);
		}
	},

	_create : function() {

		this.domref = document.createElement("ul");
		this.domref.obj = this;
		this.domref.control = this;
		base2.DOM.EventTarget(this.domref);

		if ((this._style & JSWT.BAR) == JSWT.BAR) {
			this.addClassName("jsWTMenuBar");
			this._parentNode = this._parent;
		}

		if ((this._style & JSWT.POP_UP) == JSWT.POP_UP) {
			this._visible = false;
			this.addClassName("jsWTMenuPopUp");
			this.domref.style.display = "none";
			this.domref.style.position = "absolute";
			this._parentNode = document.getElementsByTagName("body")[0];
		}

		if ((this._style & JSWT.DROP_DOWN) == JSWT.DROP_DOWN) {
			this.addClassName("jsWTMenuDropDown");
			this.domref.style.position = "absolute";
			this._parentNode = this._parent.domref;
		}

		/* buffer unregistered user-defined listeners */
		var unregisteredListener = {};
		for (var eventType in this._listener) {
			unregisteredListener[eventType] = this._listener[eventType].concat([]);
		}

		/* Menu event listener */

		/* register user-defined listeners */
		for (var eventType in unregisteredListener) {
			unregisteredListener[eventType].forEach(function(elem, index, arr) {
				this._registerListener(eventType, elem);
			}, this);
		}

		this._parentNode.appendChild(this.domref);
	},
	
	dispose : function() {
		this.$base();

		this._items.forEach(function(item, index, arr) {
			item.dispose();
		}, this);

		if (this._parentNode != null) {
			this._parentNode.removeChild(this.domref);
		}
		delete this.domref;
	},

	getItem : function(index) {
		this.checkWidget();
		if (index > this._items.length || index < 0) {
			throw new gara.OutOfBoundsException("Menu doesn't have that much items");
		}

		return this._items[index];
	},

	getItemCount : function() {
		return this._items.length;
	},

	getItems : function() {
		return this._items;
	},

	getParent : function() {
		return this._parent;
	},

	getParentItem : function() {
		return this._parent;
	},

	getVisible : function() {
		return this._visible;
	},
	
	handleEvent : function(e) {
		this.checkWidget();
		switch(e.type) {
			case "mousedown":
				if ((e.target.control ? e.target.control != this : true)
						&& this._visibleEvent != e
						&& (this.getStyle() & JSWT.POP_UP) == JSWT.POP_UP) {
					this.setVisible(false);
				}
				this._visibleEvent = null;
				break;
		}
	},

	indexOf : function(item) {
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.MenuItem)) {
			throw new TypeError("item is not instance of gara.jswt.MenuItem");
		}

		return this._items.indexOf(item);
	},

	isVisible : function() {
		return this._visible;
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
		if (this.domref != null) {
			gara.EventManager.addListener(this.domref, eventType, listener);
		}
	},

	setLocation : function(x, y) {
		this._x = x;
		this._y = y;
	},

	setVisible : function(visible, event) {
		this.checkWidget();
		this._visible = visible;
		this.update();
		if (visible) {
			this._visibleEvent = event;
			gara.EventManager.addListener(document, "mousedown", this);
			if ($class.instanceOf(this._parent, gara.jswt.Control)) {
				this._parent.addListener("mousedown", this);
			}
		} else {
			this._visibleEvent = null;
			gara.EventManager.removeListener(document, "mousedown", this);
			if ($class.instanceOf(this._parent, gara.jswt.Control)) {
				this._parent.removeListener("mousedown", this);
			}
		}
	},

	toString : function() {
		return "[gara.jswt.Menu]";
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
		if (this.domref != null) {
			gara.EventManager.removeListener(this.domref, eventType, listener);
		}
	},

	update : function() {
		this.checkWidget();
		if (!this.domref) {
			this._create();
		}

		if ((this._style & JSWT.POP_UP) == JSWT.POP_UP) {
			this.domref.style.top = this._y + "px";
			this.domref.style.left = this._x + "px";
		}
		
		if (this._visible) {
			this.domref.style.display = "block";
		} else {
			this.domref.style.display = "none";
		}
		
		this.domref.className = this._className;
		
		// update items
		this._items.forEach(function(item, index, arr) {

			// create item ...
			if (!item.isCreated()) {
				var node = item._create();
				var nextNode = index == 0 
					? this.domref.firstChild
					: arr[index - 1].domref.nextSibling;

				if (!nextNode) {
					this.domref.appendChild(node);					
				} else {
					this.domref.insertBefore(node, nextNode);
				}
			}

			// ... or update it
			if (item.hasChanged()) {
				item.update();
				item.releaseChange();
			}
		}, this);
	}
});