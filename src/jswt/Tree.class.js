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
		this._event = null;

		this._shiftItem = null;
		this._activeItem = null;
		this._className = this._baseClass = "jsWTTree";
		this._className += " jsWTTreeInactive";
		
		this._selection = [];
		this._selectionListeners = [];
		this._items = [];
		this._columns = [];
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
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.TreeItem");
		}

		// set a previous active item inactive
		if (this._activeItem != null && !this._activeItem.isDisposed()) {
			this._activeItem.setActive(false);
			this._activeItem.update();
		}

		this._activeItem = item;
		this._activeItem.setActive(true);
		this._activeItem.update();
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
	_addItem : function(item, index) {
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.TreeItem");
		}

		var parentItem = item.getParentItem();
		
		// first level item
		if (parentItem == null) {
			var append = typeof(index) == "undefined";
			
			var previousItem = this._firstLevelItems[index];
			if (previousItem) {
				var nextItemIndex = getDescendents(previousItem) + 1;
				this._items.insertAt(nextItemIndex, item);
				this._firstLevelItems.insertAt(index, item);
			} else {
				append = true;
			}
			
			if (append) {
				this._items.push(item);
				this._firstLevelItems.push(item);
			}
			
		}
		// childs
		else {
			index = this._items.indexOf(parentItem)
				+ getDescendents(parentItem);

			this._items.insertAt(index, item);
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
		if (!$class.instanceOf(listener, gara.jswt.SelectionListener)) {
			throw new TypeError("listener is not type of gara.jswt.SelectionListener");
		}
		
		if (!this._selectionListeners.contains(listener)) {
			this._selectionListeners.push(listener);
		}
	},

	_create : function() {
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
				this._registerListener(eventType, elem);
			}, this);
		}

		/* If parent is not a composite then it *must* be a HTMLElement
		 * but because of IE there is no cross-browser check. Or no one I know of.
		 */
		if (!$class.instanceOf(this._parent, gara.jswt.Composite)) {
			this._parentNode = this._parent;
		}

		if (this._parentNode != null) {
			this._parentNode.appendChild(this.domref);
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
	_deselect : function(item) {
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.TreeItem");
		}
	
		if (this._selection.contains(item)/* && item.getParent() == this*/) {
			item._setSelected(false);
			this._selection.remove(item);
			this._shiftItem = item;
			this._activateItem(item);
			this._notifySelectionListener();
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
		this.checkWidget();
		while (this._selection.length) {
			this._deselect(this._selection[0]);
		}
		this.update();
	},

	dispose : function() {
		this.deselectAll();
		this.$base();

		this._firstLevelItems.forEach(function(item, index, arr) {
			item.dispose();
		}, this);

		if (this._parentNode != null) {
			this._parentNode.removeChild(this.domref);
		}
		delete this.domref;
	},
	
	getColumnCount : function() {
		return this._columns.length;
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
		this.checkWidget();
		if (index >= this._items.length) {
			throw new gara.OutOfBoundsException("Your item lives outside of this Tree");
		}
	
		return this._firstLevelItems[index];
	},

	/**
	 * @method
	 * Returns the amount of items that are direct items of the tree
	 * 
	 * @author Thomas Gossmann
	 * @return {int} the amount
	 */
	getItemCount : function() {
		return this._firstLevelItems.length;
	},

	/**
	 * @method
	 * Returns an array with direct items of the tree
	 * 
	 * @author Thomas Gossmann
	 * @return {gara.jswt.TreeItem[]} an array with the items
	 */
	getItems : function() {
		return this._firstLevelItems;
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
		this.checkWidget();
		var obj = e.target.obj || null;
		var item = null;
		
		if (obj && $class.instanceOf(obj, gara.jswt.TreeItem)) {
			e.item = obj;
			item = obj;
		}
		e.widget = this;
		this._event = e;

		switch (e.type) {
			case "mousedown":
				if (!this._hasFocus) {
					this.forceFocus();
				}

				if (item != null) {
					
					if (e.target != item.toggleNode) {
						if (e.ctrlKey && !e.shiftKey) {
							if (this._selection.contains(item)) {
								this._deselect(item);
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
					
				}
				break;

			case "keyup":
			case "keydown":
			case "keypress":
				if (this._activeItem != null) {
					this._activeItem.handleEvent(e);
				}

				this._notifyExternalKeyboardListener(e, this, this);
				
				if (e.type == "keydown") {
					this._handleKeyEvent(e);					
				}
				break;
		}

		if (item != null) {
			item.handleEvent(e);
		}

		this.handleContextMenu(e);
		e.stopPropagation();

		/* in case of ie6, it is necessary to return false while the type of
		 * the event is "contextmenu" and the menu isn't hidden in ie6
		 */
		return false;
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
		this.checkWidget();
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
					// update scrolling
					var h = 0, activeIndex = this._items.indexOf(this._activeItem);
					for (var i = 0; i < (activeIndex - 1); i++) {
						h += this._items[i].domref.offsetHeight
							+ parseInt(gara.Utils.getStyle(this._items[i].domref, "margin-top"))
							+ parseInt(gara.Utils.getStyle(this._items[i].domref, "margin-bottom"));
						if (this._items[i]._hasChilds()) {
							var childContainer = this._items[i]._getChildContainer();
							h -= childContainer.offsetHeight
								+ parseInt(gara.Utils.getStyle(childContainer, "margin-top"))
								+ parseInt(gara.Utils.getStyle(childContainer, "margin-bottom"));
						}
					}
					if (h < this.domref.scrollTop) {
						this.domref.scrollTop = h;
					}

					// handle select
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
					// update scrolling
					var h = 0, activeIndex = this._items.indexOf(this._activeItem);
					for (var i = 0; i <= (activeIndex + 1); i++) {
						h += this._items[i].domref.offsetHeight
							+ parseInt(gara.Utils.getStyle(this._items[i].domref, "margin-top"))
							+ parseInt(gara.Utils.getStyle(this._items[i].domref, "margin-bottom"));
						if (this._items[i]._hasChilds()) {
							var childContainer = this._items[i]._getChildContainer();
							h -= childContainer.offsetHeight
								+ parseInt(gara.Utils.getStyle(childContainer, "margin-top"))
								+ parseInt(gara.Utils.getStyle(childContainer, "margin-bottom"));
						}
					}
					var viewport = this.domref.clientHeight + this.domref.scrollTop
						- parseInt(gara.Utils.getStyle(this.domref, "padding-top"))
						- parseInt(gara.Utils.getStyle(this.domref, "padding-bottom"));
					if (h > viewport) {
						this.domref.scrollTop = h - this.domref.clientHeight
							+ parseInt(gara.Utils.getStyle(this.domref, "padding-top"))
							+ parseInt(gara.Utils.getStyle(this.domref, "padding-bottom"));
					}

					// handle select
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
					this._deselect(this._activeItem);
				} else {
					this._select(this._activeItem, true);
				}
				break;
				
			case 36 : // home
				this.domref.scrollTop = 0;
			
				if (!e.ctrlKey && !e.shiftKey) {
					this._select(this._items[0], false);
				} else if (e.shiftKey) {
					this._selectShift(this._items[0], false);
				} else if (e.ctrlKey) {
					this._activateItem(this._items[0]);
				}
				break;
				
			case 35 : // end
				this.domref.scrollTop = this.domref.scrollHeight - this.domref.clientHeight;
			
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
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.TreeItem)) {
			throw new TypeError("item not instance of gara.jswt.TreeItem");
		}

		if (!this._firstLevelItems.contains(item)) {
			throw new gara.jswt.ItemNotExistsException("item [" + item + "] does not exists in this list");
		}

		return this._firstLevelItems.indexOf(item);
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
			item.widgetSelected(this._event);
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
	_registerListener : function(eventType, listener) {
		if (this.domref != null) {
			gara.EventManager.addListener(this.domref, eventType, listener);
		}
	},
	
	/**
	 * @method
	 * Removes an item from the tree
	 * 
	 * @author Thomas Gossmann
	 * @param {int} index the index of the item
	 * @return {void}
	 */
	remove : function(index) {
		this.checkWidget();
		var item = this._firstLevelItems.removeAt(index)[0];
		this._items.remove(item);
		if (!item.isDisposed()) {
			item.dispose();
		}
		delete item;
	},
	
	_removeItem : function(item) {
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.TreeItem)) {
			throw new TypeError("item not instance of gara.jswt.TreeItem");
		}
		
		this._items.remove(item);
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
	 * Removes all items from the tree
	 * 
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	removeAll : function() {
		while (this._firstLevelItems.length) {
			var item = this._firstLevelItems.pop();
			this.domref.removeChild(item.domref);
			delete item;
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
		if (!$class.instanceOf(listener, gara.jswt.SelectionListener)) {
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
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.TreeItem");
		}

		if (!_add || (this._style & JSWT.MULTI) != JSWT.MULTI) {
			while (this._selection.length) {
				var i = this._selection.pop();
				i._setSelected(false);
				i.update();
			}
		}

		if (!this._selection.contains(item)) {
			item._setSelected(true);
			this._selection.push(item);
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
		this.checkWidget();
		if ((this._style & JSWT.SINGLE) != JSWT.SINGLE) {
			this._items.forEach(function(item, index, arr){
				this._select(item, true);
			}, this);
			this.update();
		}
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
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.TreeItem");
		}

		if (!_add) {
			while (this._selection.length) {
				var i = this._selection.pop();
				i._setSelected(false);
				i.update();
			}
		}

		if ((this._style & JSWT.MULTI) == JSWT.MULTI) {
			var indexShift = this._items.indexOf(this._shiftItem);
			var indexItem = this._items.indexOf(item);
			var from = indexShift > indexItem ? indexItem : indexShift;
			var to = indexShift < indexItem ? indexItem : indexShift;

			for (var i = from; i <= to; ++i) {
				this._selection.push(this._items[i]);
				this._items[i]._setSelected(true);
				this._items[i].update();
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

	/**
	 * @method
	 * Sets the selection of the tree
	 * 
	 * @author Thomas Gossmann
	 * @param {Array} items the array with the <code>TreeItem</code> items
	 * @throws {TypeError} if the passed items are not an array
	 * @return {void}
	 */	
	setSelection : function(items) {
		this.checkWidget();
		if (!$class.instanceOf(items, Array)) {
			throw new TypeError("items are not instance of an Array");
		}

		this._selection = items;
		this._selection.forEach(function(item, index, arr) {
			item._setSelected(true);
		}, this);
		this._notifySelectionListener();
	},

	toString : function() {
		return "[gara.jswt.Tree]";
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
	
	/**
	 * @method
	 * Updates the widget
	 * 
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	update : function() {
		this.checkWidget();
		if (this.domref == null) {
			this._create();
		}

		if (this._height != null) this.domref.style.width = this._width + "px"; 
		if (this._width != null) this.domref.style.height = this._height + "px";

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

		// update items		
		this._firstLevelItems.forEach(function(item, index, arr) {
			if (item.isDisposed()) {
				this.remove(index);
			} else {
				item.update();
			}
		}, this);
	}
});