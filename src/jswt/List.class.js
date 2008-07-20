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
 * gara List Widget
 * 
 * @description
 * long description for the List Widget...
 * 
 * @class List
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @extends gara.jswt.Control
 */
$class("List", {
	$extends : gara.jswt.Control,

	/**
	 * @constructor
	 * Constructor
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.Composite|HTMLElement} parent parent dom node or composite
	 * @param {int} style The style for the list
	 * @return {gara.jswt.List} list widget
	 */
	$constructor : function(parent, style) {
		this.$base(parent, style);

		// List default style
		if (this._style == JSWT.DEFAULT) {
			this._style = JSWT.SINGLE;
		}

		this._items = [];
		this._selection = [];
		this._selectionListener = [];
		this._activeItem = null;
		this._shiftItem = null;
		this._className = this._baseClass = "jsWTList";
	},

	/**
	 * @method
	 * Activates an item
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.ListItem} item the item that should added to the List
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {void}
	 */
	_activateItem : function(item) {
		if (!$class.instanceOf(item, gara.jswt.ListItem)) {
			throw new TypeError("item is not type of gara.jswt.ListItem");
		}
		// set a previous active item inactive
		if (this._activeItem != null) {
			this._activeItem.setActive(false);
		}

		this._activeItem = item;
		this._activeItem.setActive(true);
		this.update();
	},

	/**
	 * @method
	 * Adds an item to the list (invoked by the constructor of ListItem)
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.ListItem} item the item that should added to the List
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {void}
	 */
	_addItem : function(item, index) {
		if (!$class.instanceOf(item, gara.jswt.ListItem)) {
			throw new TypeError("item is not type of gara.jswt.ListItem");
		}
		
		if (typeof(index) != "undefined") {
			this._items.insertAt(index, item);
		} else {
			this._items.push(item);
		}
	},

	/**
	 * @method
	 * Adds a selection listener on the list
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.SelectionListener} listener the desired listener to be added to this list
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @return {void}
	 */
	addSelectionListener : function(listener) {
		if (!$class.instanceOf(listener, gara.jswt.SelectionListener)) {
			throw new TypeError("listener is not instance of gara.jswt.SelectionListener");
		}

		this._selectionListener.push(listener);
	},

	/**
	 * @method
	 * Deselects an item
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.ListItem} item the item that should be deselected
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {void}
	 */
	deselect : function(item) {
		if (!$class.instanceOf(item, gara.jswt.ListItem)) {
			throw new TypeError("item not instance of gara.jswt.ListItem");
		}

		if (this._selection.contains(item)) {
			this._selection.remove(item);
			this.notifySelectionListener();
			item.setUnselected();
			this._shiftItem = item;
			this._activateItem(item);
		}
	},

	/**
	 * @method
	 * Deselects all items
	 * 
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	deselectAll : function() {
		for (var i = 0, len = this._items.length; i < len; ++i) {
			this.deselect(this._items[i]);
		}
		this.update();
	},

	/**
	 * @method
	 * Gets a specified item with a zero-related index
	 * 
	 * @author Thomas Gossmann
	 * @param {int} index the zero-related index
	 * @throws {gara.OutOfBoundsException} if the index does not live within this list
	 * @return {gara.jswt.ListItem} the item
	 */
	getItem : function(index) {
		if (index >= this._items.length) {
			throw new gara.OutOfBoundsException("Your item lives outside of this list");
		}
	
		return this._items[index];
	},

	/**
	 * @method
	 * Returns the amount of the items in the list
	 * 
	 * @author Thomas Gossmann
	 * @return {int} the amount
	 */
	getItemCount : function() {
		return this._items.length;
	},

	/**
	 * @method
	 * Returns an array with all the items in the list
	 * 
	 * @author Thomas Gossmann
	 * @return {gara.jswt.ListItem[]} the array with the items
	 */
	getItems : function() {
		return this._items;
	},

	/**
	 * @method
	 * Returns an array with the items which are currently selected in the list
	 * 
	 * @author Thomas Gossmann
	 * @return {gara.jswt.ListItem[]} an array with items
	 */
	getSelection : function() {
		return this._selection;
	},

	/**
	 * @method
	 * Returns the amount of the selected items in the tree
	 * 
	 * @author Thomas Gossmann
	 * @return {int} the amount
	 */
	getSelectionCount : function() {
		return this._selection.length;
	},

	/**
	 * @method
	 * Handles events on the list. Implements DOMEvent Interface by the W3c.
	 * 
	 * @author Thomas Gossmann
	 * @param {Event} e event the users triggers
	 * @return {void}
	 */
	handleEvent : function(e) {
		// special events for the list
		var obj = e.target.obj || null;

		switch (e.type) {
			case "mousedown":
				if (!this._hasFocus) {
					this.forceFocus();
				}

				if ($class.instanceOf(obj, gara.jswt.ListItem)) {
					var item = obj;

					if (!e.ctrlKey && !e.shiftKey) {
						this.select(item, false);
					} else if (e.ctrlKey && e.shiftKey) {
						this.selectRange(item, true);
					} else if (e.shiftKey) {
						this.selectRange(item, false);
					} else if (e.ctrlKey) {
						if (this._selection.contains(item)) {
							this.deselect(item);
						} else {
							this.select(item, true);
						}
					} else {
						this.select(item);
					}
				}
				
				if (e.which == 3 && this._menu != null) {
					if (this.domref.style.position != "") {
						this._menu.setLocation(e.layerX, e.layerY);
					} else {
						this._menu.setLocation(e.clientX, e.clientY);
					}
					this._menu.setVisible(true);
					return false;
				}
				break;

			case "keyup":
			case "keydown":
			case "keypress":

				this._items.forEach(function(item, index, arr) {
					item.handleEvent(e);
				});

				this._notifyExternalKeyboardListener(e, this, this);
				
				if (e.type == "keydown") {
					this._handleKeyEvent(e);					
				}
				break;
		}

		e.stopPropagation();
	},

	/**
	 * @method
	 * handling key events on the List
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {Event} e event the users triggers
	 * @return {void}
	 */
	_handleKeyEvent : function(e) {
	
	//	window.status = "keycode: " + e.keyCode;
		if (this._activeItem == null) {
			return;
		}

		switch (e.keyCode) {
			case 38 : // up
				// determine previous item
				var prev = false;
				var activeIndex = this.indexOf(this._activeItem);
				
				if (activeIndex != 0) {
					prev = this._items[activeIndex - 1];
				}

				if (prev) {
					if (!e.ctrlKey && !e.shiftKey) {
						//this.deselect(this._activeItem);
						this.select(prev, false);
					} else if (e.ctrlKey && e.shiftKey) {
						this.selectRange(prev, true);
					} else if (e.shiftKey) {
						this.selectRange(prev, false);
					} else if (e.ctrlKey) {
						this._activateItem(prev);
					}
				}
				break;

			case 40 : // down
				// determine next item
				var next = false;
				var activeIndex = this.indexOf(this._activeItem);
				
				// item is last;
				if (activeIndex != this._items.length - 1) {
					next = this._items[activeIndex + 1];
				}

				if (next) {
					if (!e.ctrlKey && !e.shiftKey) {
						//this.deselect(this.activeItem);
						this.select(next, false);
					} else if (e.ctrlKey && e.shiftKey) {
						this.selectRange(next, true);
					} else if (e.shiftKey) {
						this.selectRange(next, false);
					} else if (e.ctrlKey) {
						this._activateItem(next);
					}
				}
				break;

			case 32 : // space
				if (this._selection.contains(this._activeItem) && e.ctrlKey) {
					this.deselect(this._activeItem);
				} else {
					this.select(this._activeItem, true);
				}
				break;
				
			case 36 : // home
				if (!e.ctrlKey && !e.shiftKey) {
					this.select(this._items[0], false);
				} else if (e.shiftKey) {
					this.selectRange(this._items[0], false);
				} else if (e.ctrlKey) {
					this._activateItem(this._items[0]);
				}
				break;
				
			case 35 : // end
				var lastOffset = this._items.length - 1;
				if (!e.ctrlKey && !e.shiftKey) {
					this.select(this._items[lastOffset], false);
				} else if (e.shiftKey) {
					this.selectRange(this._items[lastOffset], false);
				} else if (e.ctrlKey) {
					this._activateItem(this._items[lastOffset]);
				}
				break;
		}
	},

	/**
	 * @method
	 * Looks for the index of a specified item
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.ListItem} item the item for the index
	 * @throws {gara.jswt.ItemNotExistsException} if the item does not exist in this list
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {int} the index of the specified item
	 */
	indexOf : function(item) {
		if (!$class.instanceOf(item, gara.jswt.ListItem)) {
			throw new TypeError("item not instance of gara.jswt.ListItem");
		}
	
		if (!this._items.contains(item)) {
			// TODO: ItemNotExistsException
			throw new gara.jswt.ItemNotExistsException("item [" + item + "] does not exists in this list");
			return;
		}

		return this._items.indexOf(item);
	},

	/**
	 * @method
	 * Notifies selection listener about the changed selection within the List
	 * 
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	notifySelectionListener : function() {
		for (var i = 0, len = this._selectionListener.length; i < len; ++i) {
			this._selectionListener[i].widgetSelected(this);
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
		if (this.domref != null) {
			gara.EventManager.addListener(this.domref, eventType, listener);
		}
	},

	/**
	 * @method
	 * Removes an item from the list
	 * 
	 * @author Thomas Gossmann
	 * @param {int} index the index of the item
	 * @return {void}
	 */
	remove : function(index) {
		var item = this._items.removeAt(index)[0];
		this.domref.removeChild(item.domref);
		delete item;
	},

	/**
	 * @method
	 * Removes items within an indices range
	 * 
	 * @author Thomas Gossmann
	 * @param {int} start start index
	 * @param {int} end end index
	 * @return {void}
	 */
	removeRange : function(start, end) {
		for (var i = start; i <= end; ++i) {
			this.remove(i);
		}
	},

	/**
	 * @method
	 * Removes items which indices are passed by an array
	 * 
	 * @author Thomas Gossmann
	 * @param {Array} inidices the array with the indices
	 * @return {void}
	 */
	removeFromArray : function(indices) {
		indices.forEach(function(item, index, arr) {
			this.remove(index);
		}, this);
	},

	/**
	 * @method
	 * Removes all items from the list
	 * 
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	removeAll : function() {
		while (this._items.length) {
			var item = this._items.pop();
			this.domref.removeChild(item.domref);
			delete item;
		}
	},

	/**
	 * @method
	 * Removes a selection listener from this list
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.SelectionListener} listener the listener to remove from this list
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @return {void}
	 */
	removeSelectionListener : function(listener) {
		if (!$class.instanceOf(listener, gara.jswt.SelectionListener)) {
			throw new TypeError("listener is not instance of gara.jswt.SelectionListener");
		}

		if (this._selectionListener.contains(listener)) {
			this._selectionListener.remove(listener);
		}
	},

	/**
	 * @method
	 * Selects an item
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.ListItem} item the item that should be selected
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {void}
	 */
	select : function(item, _add) {
		if (!$class.instanceOf(item, gara.jswt.ListItem)) {
			throw new TypeError("item not instance of gara.jswt.ListItem");
		}

		if (!_add || (this._style & JSWT.SINGLE) == JSWT.SINGLE) {
			while (this._selection.length) {
				this._selection.pop().setUnselected();
			}
		}

		if (!this._selection.contains(item)) {
			this._selection.push(item);
			item.setSelected();
			this._shiftItem = item;
			this._activateItem(item);
			this.notifySelectionListener();
		}
	},

	/**
	 * @method
	 * Select all items in the list
	 * 
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	selectAll : function() {
		for (var i = 0, len = this._items.length; i < len; ++i) {
			this.select(this._items[i], true);
		}
		this.update();
	},

	/**
	 * @method
	 * Selects a range. From the item with shift-lock to the passed item.
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.ListItem} item the item that should be selected
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {void}
	 */
	selectRange : function(item, _add) {
		if (!$class.instanceOf(item, gara.jswt.ListItem)) {
			throw new TypeError("item not instance of gara.jswt.ListItem");
		}

		// only, when selection mode is MULTI
		if (!_add) {
			while (this._selection.length) {
				this._selection.pop().setUnselected();
			}
		}

		if ((this._style & JSWT.MULTI) == JSWT.MULTI) {
			var indexShift = this.indexOf(this._shiftItem);
			var indexItem = this.indexOf(item);
			var from = indexShift > indexItem ? indexItem : indexShift;
			var to = indexShift < indexItem ? indexItem : indexShift;

			for (var i = from; i <= to; ++i) {
				this._selection.push(this._items[i]);
				this._items[i].setSelected();
			}

			this._activateItem(item);
			this.notifySelectionListener();
		} else {
			this.select(item);
		}
	},

	/**
	 * @method
	 * Sets the text of an item at a zero-related index
	 * 
	 * @author Thomas Gossmann
	 * @param {int} index the index for the item
	 * @param {String} string the new text for the item
	 * @throws {TypeError} if the text is not a string
	 * @throws {gara.OutOfBoundsException} if the index does not live within the List
	 * @return {void}
	 */	
	setItem : function(index, string) {
		if (typeof(string) != "string") {
			throw new TypeError("string is not type of a String");
		}

		if (index >= this._items.length) {
			throw new gara.OutOfBoundsException("item is not in List");
		}

		item[index].setText(string);
		
		this.update();
	},

	/**
	 * @method
	 * Sets the List's items to be the given Array of items
	 * 
	 * @author Thomas Gossmann
	 * @param {Array} strings the array with item texts
	 * @throws {TypeError} if the strings are not an Array
	 * @return {void}
	 */
	setItems : function(strings) {
		if (!$class.instanceOf(strings, Array)) {
			throw new TypeError("strings are not an Array");
		}

		for (var i = 0; i < strings.length; ++i) {
			if (this._items[i]) {
				this._items[i].setText(strings[i]);
			} else {
				var item = new gara.jswt.ListItem(this);
				item.setText(strings[i]);
			}
		}
		
		this.update();
	},
	
	/**
	 * @method
	 * Sets the selection of the list
	 * 
	 * @author Thomas Gossmann
	 * @param {Array} items the array with the <code>TreeItem</code> items
	 * @throws {TypeError} if the passed items are not an array
	 * @return {void}
	 */	
	setSelection : function(items) {
		if (!$class.instanceOf(items, Array)) {
			throw new TypeError("items are not instance of an Array");
		}

		this._selection = items;
		this.notifySelectionListener();
	},

	toString : function() {
		return "[gara.jswt.List]";
	},

	/**
	 * @method
	 * Updates the list!
	 * 
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	update : function() {
		// create widget if domref equals null
		if (this.domref == null) {
			this.domref = document.createElement("ul");
			this.domref.obj = this;
			this.domref.control = this;
			base2.DOM.EventTarget(this.domref);

			/* buffer unregistered user-defined listeners */
			var unregisteredListener = {};			
			for (var eventType in this._listener) {
				unregisteredListener[eventType] = this._listener[eventType].concat([]);
			}

			/* List event listener */
			this.addListener("mousedown", this);

			/* register user-defined listeners */
			for (var eventType in unregisteredListener) {
				unregisteredListener[eventType].forEach(function(elem, index, arr) {
					this.registerListener(eventType, elem);
				}, this);
			}

			/* If parent is not a composite then it *must* be a HTMLElement
			 * but because of IE there is no cross-browser check. Or no one I know of.
			 */
			if (!$class.instanceOf(this._parent, gara.jswt.Composite)) {
				this._parent.appendChild(this.domref);
			}
		}

		this.removeClassName("jsWTListFullSelection");

		if ((this._style & JSWT.FULL_SELECTION) == JSWT.FULL_SELECTION) {
			this.addClassName("jsWTListFullSelection");
		}

		this.domref.className = this._className;

		// update items
		this._items.forEach(function(item, index, arr) {

			// create item ...
			if (!item.isCreated()) {
				var node = item.create();
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