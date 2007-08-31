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
 * gara List Widget
 * 
 * @class List
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @extends Control
 */
$class("List", {
	$extends : gara.jswt.Control,

	/**
	 * @method
	 * Constructor
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.Composite|HTMLElement} parent parent dom node or composite
	 * @param {int} style The style for the list
	 * @returns {gara.jswt.List} list widget
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
	 * @returns {void}
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
	 * @returns {void}
	 */
	addItem : function(item) {
		if (!$class.instanceOf(item, gara.jswt.ListItem)) {
			throw new TypeError("item is not type of gara.jswt.ListItem");
		}
		this._items.push(item);
	},

	/**
	 * @method
	 * Adds a selection listener on the list
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.SelectionListener} listener the desired listener to be added to this list
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @returns {void}
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
	 * @returns {void}
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
	 * @returns {void}
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
	 * @returns {gara.jswt.ListItem} the item
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
	 * @returns {int} the amount
	 */
	getItemCount : function() {
		return this._items.length;
	},

	/**
	 * @method
	 * Returns an array with all the items in the list
	 * 
	 * @author Thomas Gossmann
	 * @returns {gara.jswt.ListItem[]} the array with the items
	 */
	getItems : function() {
		return this._items;
	},

	/**
	 * @method
	 * Returns an array with the items which are currently selected in the list
	 * 
	 * @author Thomas Gossmann
	 * @returns {gara.jswt.ListItem[]} an array with items
	 */
	getSelection : function() {
		return this._selection;
	},

	/**
	 * @method
	 * Returns the amount of the selected items in the tree
	 * 
	 * @author Thomas Gossmann
	 * @returns {int} the amount
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
	 * @returns {void}
	 */
	handleEvent : function(e) {
		// special events for the list
		var obj = e.target.obj || null;
		
//		console.log("List.handleEvent(" + e.type + ")");
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
	 * @returns {void}
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
	 * @returns {int} the index of the specified item
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
	 * @returns {void}
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
	 * @returns {void}
	 */
	registerListener : function(eventType, listener) {
		if (this.domref != null) {
			gara.EventManager.getInstance().addListener(this.domref, eventType, listener);
		}
	},

	/**
	 * @method
	 * Removes a selection listener from this list
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.SelectionListener} listener the listener to remove from this list
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @returns {void}
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
	 * @returns {void}
	 */
	select : function(item, _add) {
		if (!$class.instanceOf(item, gara.jswt.ListItem)) {
			throw new TypeError("item not instance of gara.jswt.ListItem");
		}

		if (!_add || (this._style & gara.jswt.SINGLE) == gara.jswt.SINGLE) {
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
	 * @returns {void}
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
	 * @returns {void}
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

	toString : function() {
		return "[gara.jswt.List]";
	},

	/**
	 * @method
	 * Updates the list!
	 * 
	 * @author Thomas Gossmann
	 * @returns {void}
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
				node = item.create();
				this.domref.appendChild(node);
			}

			// ... or update it
			if (item.hasChanged()) {
				item.update();
				item.releaseChange();
			}
		}, this);
	}
});