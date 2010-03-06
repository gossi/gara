/*	$Id: Tree.class.js 181 2009-08-02 20:51:16Z tgossmann $

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

gara.provide("gara.jswt.widgets.Tree");

gara.use("gara.Utils");
gara.use("gara.EventManager");
gara.use("gara.OutOfBoundsException");
gara.use("gara.jswt.events.SelectionListener");
gara.use("gara.jswt.widgets.TreeItem");

gara.require("gara.jswt.JSWT");
gara.require("gara.jswt.widgets.Composite");

/**
 * gara Tree Widget
 *
 * @class Tree
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @extends gara.jswt.widgets.Composite
 */
gara.Class("gara.jswt.widgets.Tree", {
	$extends : gara.jswt.widgets.Composite,

	$constructor : function(parent, style) {
		this._showLines = true;
		this._event = null;

		this._shiftItem = null;
		this._activeItem = null;

		this._selection = [];
		this._selectionListeners = [];
		this._items = [];
		this._rootLevelItems = [];

		this.$base(parent, style || gara.jswt.JSWT.SINGLE);
	},

	/**
	 * @method
	 * Activates an item
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.widgets.TreeItem} item the new item to be activated
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {void}
	 */
	_activateItem : function(item) {
		this.checkWidget();
		if (!gara.instanceOf(item, gara.jswt.widgets.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.widgets.TreeItem");
		}

		// set a previous active item inactive
		if (this._activeItem != null && !this._activeItem.isDisposed()) {
			this._activeItem._setActive(false);
		}

		this._activeItem = item;
		this._activeItem._setActive(true);

		// ARIA reference to the active item
		this.handle.setAttribute("aria-activedescendant", this._activeItem.getId());
	},

	/**
	 * @method
	 * Adds an item to the tree. This is automatically done by instantiating a new item.
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.widgets.TreeItem} item the new item to be added
	 * @throws {TypeError}
	 * @return void
	 */
	_addItem : function(item, index) {
		this.checkWidget();
		if (!gara.instanceOf(item, gara.jswt.widgets.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.widgets.TreeItem");
		}

		var parentItem = item.getParentItem();

		// first level item
		if (parentItem == null) {
			var append = typeof(index) == "undefined";

			var previousItem = this._rootLevelItems[index];
			if (previousItem) {
				var nextItemIndex = getDescendents(previousItem) + 1;
				this._items.insertAt(nextItemIndex, item);
				this._rootLevelItems.insertAt(index, item);
			} else {
				append = true;
			}

			if (append) {
				this._items.push(item);
				this._rootLevelItems.push(item);
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
	 * @param {gara.jswt.events.SelectionListener} listener the desired listener to be added to this tree
	 * @throws {TypeError} if the listener is not a SelectionListener
	 * @return {void}
	 */
	addSelectionListener : function(listener) {
		if (!gara.instanceOf(listener, gara.jswt.events.SelectionListener)) {
			throw new TypeError("listener is not type of gara.jswt.events.SelectionListener");
		}

		if (!this._selectionListeners.contains(listener)) {
			this._selectionListeners.push(listener);
		}
	},

	_createWidget : function() {
		this.$base("ul");
		this.handle.setAttribute("role", "tree");
		this.handle.setAttribute("aria-multiselectable", (this._style & gara.jswt.JSWT.MULTI) == gara.jswt.JSWT.MULTI ? true : false);
		this.handle.setAttribute("aria-activedescendant", this.getId());

		// css
		this.addClass("jsWTTree");
		this.setClass("jsWTTreeFullSelection", (this._style & gara.jswt.JSWT.FULL_SELECTION) == gara.jswt.JSWT.FULL_SELECTION);
		this.setClass("jsWTTreeCheckbox", (this._style & gara.jswt.JSWT.CHECK) == gara.jswt.JSWT.CHECK);
		this.setClass("jsWTTreeLines", this._showLines);
		this.setClass("jsWTTreeNoLines", !this._showLines);

		// listeners
		this.addListener("mousedown", this);
		if ((this._style & gara.jswt.JSWT.CHECK) == gara.jswt.JSWT.CHECK) {
			this.addListener("mouseup", this);
		}
	},

	/**
	 * @method
	 * Deselects a specific item
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.widgets.TreeItem} item the item to deselect
	 * @return {void}
	 */
	_deselect : function(item) {
		this.checkWidget();
		if (!gara.instanceOf(item, gara.jswt.widgets.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.widgets.TreeItem");
		}

		if (this._selection.contains(item)/* && item.getParent() == this*/) {
			item._setSelected(false);
			this._selection.remove(item);
			this._shiftItem = item;
			this._notifySelectionListener();
		}
	},

	/**
	 * @method
	 * Deselects all items in the <code>Tree</code>
	 *
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	deselectAll : function() {
		this.checkWidget();
		while (this._selection.length) {
			this._selection.pop()._setSelected(false);
		}
		this._notifySelectionListener();
	},

	dispose : function() {
		this.deselectAll();
		this.$base();

		this._rootLevelItems.forEach(function(item, index, arr) {
			item.dispose();
		}, this);

		if (this._parentNode != null) {
			this._parentNode.removeChild(this.handle);
		}
		delete this.handle;
	},

	focusGained : function(e) {
		if (this._activeItem == null && this._items.length) {
			this._activateItem(this._items[0]);
		}

		this.$base(e);
	},

	getColumnCount : function() {
		return 0;
	},

	/**
	 * @method
	 * Returns a specifiy item with a zero-related index
	 *
	 * @author Thomas Gossmann
	 * @param {int} index the zero-related index
	 * @throws {gara.OutOfBoundsException} if the index does not live within this tree
	 * @return {gara.jswt.widgets.TreeItem} the item
	 */
	getItem : function(index) {
		this.checkWidget();
		if (index >= this._rootLevelItems.length || index < 0) {
			throw new gara.OutOfBoundsException("Your item lives outside of this Tree");
		}

		return this._rootLevelItems[index];
	},

	/**
	 * @method
	 * Returns the amount of items that are direct items of the tree
	 *
	 * @author Thomas Gossmann
	 * @return {int} the amount
	 */
	getItemCount : function() {
		return this._rootLevelItems.length;
	},

	_getItemHeight : function(item) {
		var h = item.handle.offsetHeight
			+ parseInt(gara.Utils.getStyle(item.handle, "margin-top"))
			+ parseInt(gara.Utils.getStyle(item.handle, "margin-bottom"));
		if (item._hasChilds()) {
			var childContainer = item._getChildContainer();
			h -= childContainer.offsetHeight
				+ parseInt(gara.Utils.getStyle(childContainer, "margin-top"))
				+ parseInt(gara.Utils.getStyle(childContainer, "margin-bottom"));
		}
		return h;
	},

	/**
	 * @method
	 * Returns an array with direct items of the tree
	 *
	 * @author Thomas Gossmann
	 * @return {gara.jswt.widgets.TreeItem[]} an array with the items
	 */
	getItems : function() {
		return this._rootLevelItems;
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
	 * @return {gara.jswt.widgets.TreeItem[]}an array with items
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

	getTopItem : function() {
		if (!this._items.length) {
			return null;
		}

		var scrollTop = this._scrolledHandle().scrollTop;
		var h = 0;
		for (var i = 0; i < this._items.length; i++) {
			h += this._getItemHeight(this._items[i]);
			if (h > scrollTop) {
				return this._items[i];
			}
		}
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

		// special events for the list
		var widget = e.target.widget || null;
		e.item = widget && gara.instanceOf(widget, gara.jswt.widgets.TreeItem) ? widget : this._activeItem;
		e.widget = this;
		this._event = e;

		this._handleMouseEvents(e);
		if (this._menu != null && this._menu.isVisible()) {
			this._menu.handleEvent(e);
		} else {
			this._handleKeyEvents(e);
			this._handleContextMenu(e);
		}

		this.$base(e);

		if (e.item != null) {
			e.item.handleEvent(e);
		}

		e.stopPropagation();
		/* in case of ie6, it is necessary to return false while the type of
		 * the event is "contextmenu" and the menu isn't hidden in ie6
		 */
		return false;
	},

	_handleMouseEvents : function(e) {
		var item = e.item;
		switch (e.type) {
			case "mousedown":
				if (item != null) {
					if (e.ctrlKey && !e.shiftKey) {
						if (this._selection.contains(item)) {
							this._deselect(item);
						} else {
							this._selectAdd(item, true);
						}
					} else if (!e.ctrlKey && e.shiftKey) {
						this._selectShift(item, false);
					} else if (e.ctrlKey && e.shiftKey) {
						this._selectShift(item, true);
					} else {
						this._selectAdd(item, false);
					}
					this._activateItem(item);
				}
				break;
		}
	},

	_handleKeyEvents : function(e) {
		switch (e.type) {
			case "keyup":
			case "keydown":
			case "keypress":
				if (e.type == "keydown") {
					this._handleKeyNavigation(e);
				}

				// prevent default when scrolling keys are used
				this._preventScrolling(e);
				break;
		}
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
	_handleKeyNavigation : function(e) {
		switch (e.keyCode) {

			// up
			case gara.jswt.JSWT.ARROW_UP:

				// determine previous item
				var prev;

				if (this._activeItem == this._items[0]) {
					// item is root;
					prev = false;
				} else {
					var siblings;
					var parentWidget = this._activeItem.getParentItem();
					if (parentWidget == null) {
						siblings = this._rootLevelItems;
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
						h += this._getItemHeight(this._items[i]);
					}
					var viewport = this.handle.clientHeight + this.handle.scrollTop
						- parseInt(gara.Utils.getStyle(this.handle, "padding-top"))
						- parseInt(gara.Utils.getStyle(this.handle, "padding-bottom"));
					var itemAddition = this._getItemHeight(prev);

					this.handle.scrollTop = h < this.handle.scrollTop ? h : (viewport < h ? h - viewport + itemAddition : this.handle.scrollTop);

					// handle select
					if (!e.ctrlKey && !e.shiftKey) {
						this._activateItem(prev);
						this._selectAdd(prev, false);
					} else if (e.ctrlKey && e.shiftKey) {
						this._activateItem(prev);
						this._selectShift(prev, true);
					} else if (e.shiftKey) {
						this._activateItem(prev);
						this._selectShift(prev, false);
					} else if (e.ctrlKey) {
						this._activateItem(prev);
					}
				}
				break;

			// down
			case gara.jswt.JSWT.ARROW_DOWN:

				// determine next item
				var next;
				var siblings;

				// item is last;
				if (this._activeItem == this._items[this._items.length - 1]) {
					next = false;
				} else {
					var parentWidget = this._activeItem.getParentItem();
					if (parentWidget == null) {
						siblings = this._rootLevelItems;
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
						h+= this._getItemHeight(this._items[i]);
					}
					var min = h - this._getItemHeight(next);
					var viewport = this.handle.clientHeight + this.handle.scrollTop
						- parseInt(gara.Utils.getStyle(this.handle, "padding-top"))
						- parseInt(gara.Utils.getStyle(this.handle, "padding-bottom"));
					var scrollRange = h - this.handle.clientHeight
						+ parseInt(gara.Utils.getStyle(this.handle, "padding-top"))
						+ parseInt(gara.Utils.getStyle(this.handle, "padding-bottom"));

					this.handle.scrollTop = h > viewport ? (scrollRange) : (this.handle.scrollTop > min ? min : this.handle.scrollTop);


					// handle select
					if (!e.ctrlKey && !e.shiftKey) {
						this._activateItem(next);
						this._selectAdd(next, false);
					} else if (e.ctrlKey && e.shiftKey) {
						this._activateItem(next);
						this._selectShift(next, true);
					} else if (e.shiftKey) {
						this._activateItem(next);
						this._selectShift(next, false);
					} else if (e.ctrlKey) {
						this._activateItem(next);
					}
				}
				break;

			// left - collapse tree
			case gara.jswt.JSWT.ARROW_LEFT:
				var buffer = this._activeItem;
				this._activeItem.setExpanded(false);
				this._activateItem(buffer);
				break;

			// right - expand tree
			case gara.jswt.JSWT.ARROW_RIGHT:
				this._activeItem.setExpanded(true);
				break;

			// space
			case gara.jswt.JSWT.SPACE:
				this._activeItem.setChecked(!this._activeItem.getChecked());
				if (this._selection.contains(this._activeItem) && e.ctrlKey) {
					this._deselect(this._activeItem);
				} else {
					this._selectAdd(this._activeItem, true);
				}
				break;

			// home
			case gara.jswt.JSWT.HOME:
				this.handle.scrollTop = 0;

				if (!e.ctrlKey && !e.shiftKey) {
					this._activateItem(this._items[0]);
					this._selectAdd(this._items[0], false);
				} else if (e.shiftKey) {
					this._activateItem(this._items[0]);
					this._selectShift(this._items[0], false);
				} else if (e.ctrlKey) {
					this._activateItem(this._items[0]);
				}
				break;

			// end
			case gara.jswt.JSWT.END:
				this.handle.scrollTop = this.handle.scrollHeight - this.handle.clientHeight;

				if (!e.ctrlKey && !e.shiftKey) {
					this._activateItem(this._items[this._items.length-1]);
					this._selectAdd(this._items[this._items.length-1], false);
				} else if (e.shiftKey) {
					this._activateItem(this._items[this._items.length-1]);
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
	 * @param {gara.jswt.widgets.TreeItem} item the item for the index
	 * @throws {TypeError} if the item is not a TreeItem
	 * @return {int} the index of the specified item
	 */
	indexOf : function(item) {
		this.checkWidget();
		if (!gara.instanceOf(item, gara.jswt.widgets.TreeItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.TreeItem");
		}

		if (!this._rootLevelItems.contains(item)) {
			return -1;
		}

		return this._rootLevelItems.indexOf(item);
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
		this._selectionListeners.forEach(function(listener) {
			listener.widgetSelected(this._event);
		}, this);
	},

	/**
	 * @method
	 * Register listeners for this widget. Implementation for gara.jswt.widgets.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_registerListener : function(eventType, listener) {
		gara.EventManager.addListener(this.handle, eventType, listener);
	},

	_removeItem : function(item) {
		this.checkWidget();
		if (!gara.instanceOf(item, gara.jswt.widgets.TreeItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.TreeItem");
		}

		this._items.remove(item);
		this._rootLevelItems.remove(item);
	},

	/**
	 * @method
	 * Removes all items from the tree
	 *
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	removeAll : function() {
		this.checkWidget();
		this._items = [];
		this._rootLevelItems = [];
	},

	/**
	 * @method
	 * Removes a selection listener from this tree
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.widgets.SelectionListener} listener the listener to be removed from this tree
	 * @throws {TypeError} if the listener is not a SelectionListener
	 * @return {void}
	 */
	removeSelectionListener : function(listener) {
		if (!gara.instanceOf(listener, gara.jswt.widgets.SelectionListener)) {
			throw new TypeError("item is not type of gara.jswt.widgets.SelectionListener");
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
	 * @param {gara.jswt.widgets.TreeItem} item the item to select
	 * @param {boolean} _add true for adding to the current selection, false will select only this item
	 * @throws {TypeError} if the item is not a TreeItem
	 * @return {void}
	 */
	_selectAdd : function(item, _add) {
		this.checkWidget();
		if (!gara.instanceOf(item, gara.jswt.widgets.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.widgets.TreeItem");
		}

		if (!_add || (this._style & gara.jswt.JSWT.MULTI) != gara.jswt.JSWT.MULTI) {
			while (this._selection.length) {
				var i = this._selection.pop();
				i._setSelected(false);
			}
		}

		if (!this._selection.contains(item)) {
			item._setSelected(true);
			this._selection.push(item);
			this._shiftItem = item;
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
		if ((this._style & gara.jswt.JSWT.SINGLE) != gara.jswt.JSWT.SINGLE) {
			this._items.forEach(function(item){
				if (!this._selection.contains(item)) {
					this._selection.push(item);
					item._setSelected(true);
				}
			}, this);
			this._notifySelectionListener();
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
		if (!gara.instanceOf(item, gara.jswt.widgets.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.widgets.TreeItem");
		}

		if (!_add) {
			while (this._selection.length) {
				var i = this._selection.pop();
				i._setSelected(false);
			}
		}

		if ((this._style & gara.jswt.JSWT.MULTI) == gara.jswt.JSWT.MULTI) {
			var indexShift = this._items.indexOf(this._shiftItem);
			var indexItem = this._items.indexOf(item);
			var from = indexShift > indexItem ? indexItem : indexShift;
			var to = indexShift < indexItem ? indexItem : indexShift;

			for (var i = from; i <= to; ++i) {
				this._selection.push(this._items[i]);
				this._items[i]._setSelected(true);
			}

			this._notifySelectionListener();
		} else {
			this._selectAdd(item);
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
		this.setClass("jsWTTreeLines", this._showLines);
		this.setClass("jsWTTreeNoLines", !this._showLines);
		return this;
	},

	/**
	 * @method
	 * Sets the selection of the <code>Tree</code>
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.widgets.TreeItem[]|gara.jswt.widgets.TreeItem} items the array with the <code>TreeItem</code> items
	 * @return {void}
	 */
	setSelection : function(items) {
		this.checkWidget();

		while (this._selection.length) {
			var item = this._selection.pop();
			if (!item.isDisposed()) {
				item._setSelected(false);
			}
		}

		if (gara.instanceOf(items, Array)) {
			if (items.length > 1 && (this._style & gara.jswt.JSWT.MULTI) == gara.jswt.JSWT.MULTI) {
				items.forEach(function(item) {
					if (!this._selection.contains(item)) {
						item._setSelected(true);
						this._selection.push(item);
					}
				}, this);
				this._notifySelectionListener();
			} else if (items.length) {
				this._selectAdd(items[items.length - 1], true);
			}
		} else if (gara.instanceOf(items, gara.jswt.widgets.ListItem)) {
			this._selectAdd(this.indexOf(items), true);
		}
		return this;
	},

	setTopItem : function(item) {
		if (!gara.instanceOf(item, gara.jswt.widgets.TreeItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.TreeItem");
		}

		var index = this._items.indexOf(item);
		var h = 0;
		for (var i = 0; i < index; i++) {
			h += this._getItemHeight(this._items[i]);
		}

		this._scrolledHandle().scrollTop = h;
		return this;
	},

//	setWidth : function(width) {
//		console.log("Tree.setWidth (padding-left)" + gara.Utils.getStyle(this.handle, "padding-left"));
//		console.log("Tree.setWidth (padding-right)" + gara.Utils.getStyle(this.handle, "padding-right"));
//		console.log("Tree.setWidth (border-left-width)" + gara.Utils.getStyle(this.handle, "border-left-width"));
//		console.log("Tree.setWidth (border-right-width)" + gara.Utils.getStyle(this.handle, "border-right-width"));
//		this.$base(width);
//		console.log("Tree.setWidth: " + width);
//		return this;
//	},

	showItem : function(item) {
		if (!gara.instanceOf(item, gara.jswt.widgets.TreeItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.TreeItem");
		}

		if (this.getVerticalScrollbar()) {
			var index = this._items.indexOf(item);
			var h = 0;
			for (var i = 0; i <= index; i++) {
				h += this._getItemHeight(this._items[i]);
			}

			if ((this._scrolledHandle().scrollTop + this._scrolledHandle().clientHeight) < h
					|| this._scrolledHandle().scrollTop > h) {
				var newScrollTop = h - Math.round(this._getItemHeight(this._items[index]) / 2) - Math.round(this._scrolledHandle().clientHeight / 2);
				this._scrolledHandle().scrollTop = newScrollTop;
			}
		}
	},

	showSelection : function() {
		if (this._selection.length) {
			this.showItem(this._selection[0]);
		}
	},

	/**
	 * @method
	 * Unregister listeners for this widget. Implementation for gara.jswt.widgets.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_unregisterListener : function(eventType, listener) {
		gara.EventManager.removeListener(this.handle, eventType, listener);
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

		// create
		if (this.handle == null) {
			this._create();
		}

		// measurements
		this.handle.style.width = this._width != null ? (this._width - parseInt(gara.Utils.getStyle(this.handle, "padding-left")) - parseInt(gara.Utils.getStyle(this.handle, "padding-right")) - parseInt(gara.Utils.getStyle(this.handle, "border-left-width")) - parseInt(gara.Utils.getStyle(this.handle, "border-right-width"))) + "px" : "auto";
		this.handle.style.height = this._height != null ? (this._height - parseInt(gara.Utils.getStyle(this.handle, "padding-top")) - parseInt(gara.Utils.getStyle(this.handle, "padding-bottom")) - parseInt(gara.Utils.getStyle(this.handle, "border-top-width")) - parseInt(gara.Utils.getStyle(this.handle, "border-bottom-width"))) + "px" : "auto";

		// update items
		var i = 0;
		var len = this._rootLevelItems.length;
		while (i < len) {
			var item = this._rootLevelItems[i];
			if (item.isDisposed()) {
				this._removeItem(item);
				len--;
			} else {
				item.update();
				i++;
			}
		}
	}
});