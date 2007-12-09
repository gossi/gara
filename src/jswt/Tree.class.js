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
 * gara Tree Widget
 * 
 * @class Tree
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @extends gara.jswt.Composite
 */
$class("Tree", {
	$extends : gara.jswt.Composite,

	$constructor : function(parent, style) {
		this.$base(parent, style);
		
		// Tree default style
		if (this._style == JSWT.DEFAULT) {
			this._style = JSWT.SINGLE;
		}
		
		this._showLines = true;

		this._shiftItem = null;
		this._activeItem = null;
		this._className = this._baseClass = "jsWTTree";
		
		this._selection = [];
		this._selectionListeners = [];
		this._items = [];
		this._firstLevelItems = [];
	},

	/**
	 * @method
	 * Activates an item
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.TreeItem} item the new item to be activated
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {void}
	 */
	_activateItem : function(item) {
		if (!$class.instanceOf(item, gara.jswt.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.TreeItem");
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
	 * Adds an item to the tree. This is automatically done by instantiating a new item.
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.TreeItem} item the new item to be added
	 * @throws WrongObjectException
	 * @return void
	 */
	_addItem : function(item) {
		if (!$class.instanceOf(item, gara.jswt.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.TreeItem");
		}

		var parentItem = item.getParentItem()
		if (parentItem == null) {
			this._items.push(item);
			this._firstLevelItems.push(item);
		} else {
			var index = this._items.indexOf(parentItem)
				+ getDescendents(parentItem)
				+ 1;

			this._items.splice(index, 0, item);
		}

		function getDescendents(item) {
			var childs = 0;
			if (item.getItemCount() > 0) {
				item.getItems().forEach(function(child, index, arr) {
					if (child.getItemCount() > 0) {
						childs += getDescendents(child);
					}
					childs++;
				}, this);
			}
			return childs;
		}
	},

	/**
	 * @method
	 * Adds a selection listener on the tree
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.SelectionListener} listener the desired listener to be added to this tree
	 * @throws {TypeError} if the listener is not a SelectionListener
	 * @return {void}
	 */
	addSelectionListener : function(listener) {
		if (!$class.instanceOf(item, gara.jswt.SelectionListener)) {
			throw new TypeError("listener is not type of gara.jswt.SelectionListener");
		}
		
		if (!this._selectionListeners.contains(listener)) {
			this._selectionListeners.push(listener);
		}
	},
	
	/**
	 * @method
	 * Deselects a specific item
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.TreeItem} item the item to deselect
	 * @return {void}
	 */
	deselect : function(item) {
		if (!$class.instanceOf(item, gara.jswt.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.TreeItem");
		}
	
		if (this._selection.contains(item)
				&& item.getParent() == this) {
			this._selection.remove(item);
			this._notifySelectionListener();
			item.setChecked(false);
			this._shiftItem = item;
			this._activateItem(item);
		}
	},

	/**
	 * @method
	 * Deselect all items in the tree
	 * 
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	deselectAll : function() {
		for (var i = this._selection.length; i >= 0; --i) {
			this.deselect(this._selection[i]);
		}
		this.update();
	},

	/**
	 * @method
	 * Returns a specifiy item with a zero-related index
	 * 
	 * @author Thomas Gossmann
	 * @param {int} index the zero-related index
	 * @throws {gara.OutOfBoundsException} if the index does not live within this tree
	 * @return {gara.jswt.TreeItem} the item
	 */
	getItem : function(index) {
		if (index >= this._items.length) {
			throw new gara.OutOfBoundsException("Your item lives outside of this Tree");
		}
	
		return this._items[index];
	},

	/**
	 * @method
	 * Returns the amount of the items in the tree
	 * 
	 * @author Thomas Gossmann
	 * @return {int} the amount
	 */
	getItemCount : function() {
		return this._items.length;
	},

	/**
	 * @method
	 * Returns an array with all the items in the tree
	 * 
	 * @author Thomas Gossmann
	 * @return {gara.jswt.TreeItem[]} an array with the items
	 */
	getItems : function() {
		return this._items;
	},

	/**
	 * @method
	 * Returns whether the lines of the tree are visible or not
	 * 
	 * @author Thomas Gossmann
	 * @return {boolean} true if the lines are visible and false if they are not
	 */
	getLinesVisible : function() {
		return this._showLines;
	},

	/**
	 * @method
	 * Returns an array with the items which are currently selected in the tree
	 * 
	 * @author Thomas Gossmann
	 * @return {gara.jswt.TreeItem[]}an array with items
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
	 * Event Handler for the tree
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {Event} W3C-event
	 * @return {void}
	 */
	handleEvent : function(e) {
		// special events for the tree
		var obj = e.target.obj || null;
		var item = null;
		
		if ($class.instanceOf(obj, gara.jswt.TreeItem)) {
			item = obj;
		}
		
		switch (e.type) {
			case "mousedown":
				if (!this._hasFocus) {
					this.forceFocus();
				}

				if (item != null) {
					if (e.ctrlKey && !e.shiftKey) {
						if (this._selection.contains(item)) {
							this.deselect(item);
						} else {
							this._select(item, true);
						}
					} else if (!e.ctrlKey && e.shiftKey) {
						this._selectShift(item, false);
					} else if (e.ctrlKey && e.shiftKey) {
						this._selectShift(item, true);
					} else {
						this._select(item, false);
					}

				}
				break;

			case "dblclick":
				// dummy handler. dblclick event is passed to the item
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

		if (item != null) {
			item.handleEvent(e);
		}

		e.stopPropagation();
	},

	/**
	 * @method
	 * Key Event Handler for the Tree
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {Event} W3C-Event
	 * @return {void}
	 */
	_handleKeyEvent : function(e) {
		if (this._activeItem == null) {
			return;
		}
	
		switch (e.keyCode) {
			case 38 : // up
				// determine previous item
				var prev;

				if (this._activeItem == this._items[0]) {
					// item is root;
					prev = false;
				} else {
					var siblings;
					var parentWidget = this._activeItem.getParentItem();
					if (parentWidget == null) {
						siblings = this._firstLevelItems;
					} else {
						siblings = parentWidget.getItems();
					}
					var sibOffset = siblings.indexOf(this._activeItem);
		
					// prev item is parent
					if (sibOffset == 0) {
						prev = parentWidget;
					} else {
						var prevSibling = siblings[sibOffset - 1];
						prev = getLastItem(prevSibling);
					}
				}
				
				if (prev) {
					if (!e.ctrlKey && !e.shiftKey) {
						this._select(prev, false);
					} else if (e.ctrlKey && e.shiftKey) {
						this._selectShift(prev, true);
					} else if (e.shiftKey) {
						this._selectShift(prev, false);
					} else if (e.ctrlKey) {
						this._activateItem(prev);
					}
				}
			break;
	
			case 40 : // down
				// determine next item
				var next;
				var siblings;
				
				// item is last;
				if (this._activeItem == this._items[this._items.length - 1]) {
					next = false;
				} else {
					var parentWidget = this._activeItem.getParentItem();
					if (parentWidget == null) {
						siblings = this._firstLevelItems;
					} else {
						siblings = parentWidget.getItems();
					}
					var sibOffset = siblings.indexOf(this._activeItem);
		
					if (this._activeItem.getItemCount() > 0 && this._activeItem.getExpanded()) {
						next = this._activeItem.getItems()[0];
					} else if (this._activeItem.getItemCount() > 0 && !this._activeItem.getExpanded()) {
						next = this._items[this._items.indexOf(this._activeItem) + countItems(this._activeItem) + 1];
					} else {
						next = this._items[this._items.indexOf(this._activeItem) + 1];
					}
				}

				if (next) {
					if (!e.ctrlKey && !e.shiftKey) {
						this._select(next, false);
					} else if (e.ctrlKey && e.shiftKey) {
						this._selectShift(next, true);
					} else if (e.shiftKey) {
						this._selectShift(next, false);
					} else if (e.ctrlKey) {
						this._activateItem(next);
					}
				}
				break;
			
			case 37: // left
				// collapse tree
				var buffer = this._activeItem;
				this._activeItem.setExpanded(false);
				this._activateItem(buffer);
				this.update();
				break;
	
			case 39: // right
				// expand tree
				this._activeItem.setExpanded(true);
				this.update();
				break;
				
			case 32 : // space
				if (this._selection.contains(this._activeItem) && e.ctrlKey) {
					this.deselect(this._activeItem);
				} else {
					this._select(this._activeItem, true);
				}
				break;
				
			case 36 : // home
				if (!e.ctrlKey && !e.shiftKey) {
					this._select(this._items[0], false);
				} else if (e.shiftKey) {
					this._selectShift(this._items[0], false);
				} else if (e.ctrlKey) {
					this._activateItem(this._items[0]);
				}
				break;
				
			case 35 : // end
				if (!e.ctrlKey && !e.shiftKey) {
					this._select(this._items[this._items.length-1], false);
				} else if (e.shiftKey) {
					this._selectShift(this._items[this._items.length-1], false);
				} else if (e.ctrlKey) {
					this._activateItem(this._items[this._items.length-1]);
				}
				break;
		}
	
		function getLastItem(item) {
			if (item.getExpanded() && item.getItemCount() > 0) {
				return getLastItem(item.getItems()[item.getItemCount() - 1]);
			} else {
				return item;
			}
		}
		
		function countItems(item) {
			var items = 0;
			var childs = item.getItems();
			
			for (var i = 0; i < childs.length; ++i) {
				items++;
				if (childs[i].getItemCount() > 0) {
					items += countItems(childs[i]);
				}
			}
			
			return items;
		}
	},

	/**
	 * @method
	 * Looks for the index of a specified item
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.TreeItem} item the item for the index
	 * @throws {gara.jswt.ItemNotExistsException} if the item does not exist in this tree
	 * @throws {TypeError} if the item is not a TreeItem
	 * @return {int} the index of the specified item
	 */
	indexOf : function(item) {
		if (!$class.instanceOf(item, gara.jswt.TreeItem)) {
			throw new TypeError("item not instance of gara.jswt.TreeItem");
		}

		if (!this._items.contains(item)) {
			throw new gara.jswt.ItemNotExistsException("item [" + item + "] does not exists in this list");
		}

		return this._items.indexOf(item);
	},

	/**
	 * @method
	 * Notifies all selection listeners about the selection change
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_notifySelectionListener : function() {
		this._selectionListeners.forEach(function(item, index, arr) {
			item.widgetSelected(this);
		}, this);
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
			gara.EventManager.getInstance().addListener(this.domref, eventType, listener);
		}
	},

	/**
	 * @method
	 * Removes a selection listener from this tree
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.SelectionListener} listener the listener to be removed from this tree
	 * @throws {TypeError} if the listener is not a SelectionListener
	 * @return {void}
	 */
	removeSelectionListener : function(listener) {
		if (!$class.instanceOf(item, gara.jswt.SelectionListener)) {
			throw new TypeError("item is not type of gara.jswt.SelectionListener");
		}

		if (this._selectionListeners.contains(listener)) {
			this._selectionListeners.remove(listener);
		}
	},

	/**
	 * @method
	 * Selects a specific item
	 *
	 * @private 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.TreeItem} item the item to select
	 * @param {boolean} _add true for adding to the current selection, false will select only this item
	 * @throws {TypeError} if the item is not a TreeItem
	 * @return {void}
	 */
	_select : function(item, _add) {
		if (!$class.instanceOf(item, gara.jswt.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.TreeItem");
		}

		if (!_add || (this._style & JSWT.MULTI) != JSWT.MULTI) {
			while (this._selection.length) {
				this._selection.pop().setChecked(false);
			}
		}

		if (!this._selection.contains(item)
				&& item.getParent() == this) {
			this._selection.push(item);
			item.setChecked(true);
			this._shiftItem = item;
			this._activateItem(item);
			this._notifySelectionListener();
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
		this._items.forEach(function(item, index, arr) {
			this._select(item, true);
		}, this);
		this.update();
	},

	/**
	 * @method
	 * Selects a Range of items. From shiftItem to the passed item.
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_selectShift : function(item, _add) {
		if (!$class.instanceOf(item, gara.jswt.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.TreeItem");
		}

		if (!_add) {
			while (this._selection.length) {
				this._selection.pop().setChecked(false);
			}
		}

		if ((this._style & JSWT.MULTI) == JSWT.MULTI) {
			var indexShift = this.indexOf(this._shiftItem);
			var indexItem = this.indexOf(item);
			var from = indexShift > indexItem ? indexItem : indexShift;
			var to = indexShift < indexItem ? indexItem : indexShift;

			for (var i = from; i <= to; ++i) {
				this._selection.push(this._items[i]);
				this._items[i].setChecked(true);
			}

			this._activateItem(item);			
			this._notifySelectionListener();
		} else {
			this._select(item);
		}
	},
	
	/**
	 * @method
	 * Sets lines visible or invisible.
	 * 
	 * @author Thomas Gossmann
	 * @param {boolean} show true if the lines should be visible or false for invisibility
	 * @return {void}
	 */
	setLinesVisible : function(show) {
		this._showLines = show;
	},

	toString : function() {
		return "[gara.jswt.Tree]";
	},
	
	/**
	 * @method
	 * Updates the widget
	 * 
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	update : function() {
		if (this.domref == null) {
			this.domref = document.createElement("ul");
			this.domref.obj = this;
			this.domref.control = this;
			base2.DOM.EventTarget(this._domref);

			/* buffer unregistered user-defined listeners */
			var unregisteredListener = {};			
			for (var eventType in this._listener) {
				unregisteredListener[eventType] = this._listener[eventType].concat([]);
			}

			/* List event listener */
			this.addListener("mousedown", this);
			this.addListener("dblclick", this);

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

		this.removeClassName("jsWTTreeNoLines");
		this.removeClassName("jsWTTreeLines");
		this.removeClassName("jsWTTreeFullSelection");	

		if (this._showLines) {
			this.addClassName("jsWTTreeLines");
		} else {
			this.addClassName("jsWTTreeNoLines");
		}
		
		if ((this._style & JSWT.FULL_SELECTION) == JSWT.FULL_SELECTION) {
			this.addClassName("jsWTTreeFullSelection");
		}

		this.domref.className = this._className;
		this._updateItems(this._firstLevelItems, this.domref);
	},
	
	/**
	 * @method
	 * Update Items
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.TreeItem[]} items to update
	 * @param {HTMLElement} parentNode the parent dom node
	 * @return {void}  
	 */
	_updateItems : function(items, parentNode) {
		var itemCount = items.length;
		items.forEach(function(item, index, arr) {
			var bottom = (index + 1) == itemCount;

			// create item ...
			if (!item.isCreated()) {
				item.create(bottom);
				parentNode.appendChild(item.domref);
			}

			// ... or update it
			if (item.hasChanged()) {
				item.update();
				item.releaseChange();
			}

	
			if (item.getItemCount() > 0) {
				var childContainer = item._getChildContainer();
				this._updateItems(item.getItems(), childContainer);			
			}

			if (bottom && item.getClassName().indexOf("bottom") == -1) {
				item.addClassName("bottom");
				if (item.getItemCount() > 0) {
					var cc = item._getChildContainer();
					cc.className = "bottom";
				}
			} else if (!bottom && item.getClassName().indexOf("bottom") != -1) {
				item.removeClassName("bottom");
				if (item.getItemCount() > 0) {
					var cc = item._getChildContainer();
					cc.className = null;
				}
			}
		}, this);
	}
});