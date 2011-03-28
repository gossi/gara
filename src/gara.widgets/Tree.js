/*

		gara - Javascript Toolkit
	===========================================================================

		Copyright (c) 2007 Thomas Gossmann

		Homepage:
			http://garathekit.org

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

"use strict";

gara.provide("gara.widgets.Tree", "gara.widgets.Composite");

gara.use("gara.widgets.TreeItem");

/**
 * gara Tree Widget
 *
 * @class gara.widgets.Tree
 * @extends gara.widgets.Composite
 */
gara.Class("gara.widgets.Tree", function() { return /** @lends gara.widgets.Tree# */ {
	$extends : gara.widgets.Composite,

	/**
	 * Contains the activeItem
	 *
	 * @private
	 * @type {gara.widgets.TreeItem}
	 */
	activeItem : null,

	/**
	 * Contains the items
	 *
	 * @private
	 * @type {gara.widgets.TreeItem[]}
	 */
	items : [],

	/**
	 * Contains the root items
	 *
	 * @private
	 * @type {gara.widgets.TreeItem[]}
	 */
	rootItems : [],

	/**
	 * Contains the current selection.
	 *
	 * @private
	 * @type {gara.widgets.ListItem}
	 */
	selection : [],

	/**
	 * A collection of listeners that will be notified, when the selection
	 * of the <code>List</code> changes.
	 *
	 * @private
	 * @type {gara.events.SelectionListener[]}
	 */
	selectionListeners : [],

	/**
	 * Holds the show lines state
	 *
	 * @private
	 * @type {boolean}
	 */
	showLines : true,

	/**
	 * Contains the item that was active when shift was pressed.
	 *
	 * @private
	 * @type {gara.widgets.ListItem}
	 */
	shiftItem : null,

	/**
	 * Creates a new Tree.
	 * @constructs
	 * @extends gara.widgets.Composite
	 * 
	 * @param {gara.widgets.Composite|HTMLElement} parent parent dom node or composite
	 * @param {int} style The style for the tree
	 */
	$constructor : function (parent, style) {
		this.items = [];
		this.rootItems = [];

		this.showLines = true;
		this.activeItem = null;
		this.shiftItem = null;

		this.selection = [];
		this.selectionListeners = [];
		this.treeListeners = [];

		this.$super(parent, style || gara.SINGLE);
		this.addFocusListener(this);
	},

	/**
	 * Activates an item
	 *
	 * @private
	 * @param {gara.widgets.TreeItem} item the new item to be activated
	 * @throws {TypeError} if the item is not a ListItem
	 * @returns {void}
	 */
	activateItem : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.widgets.TreeItem)) {
			throw new TypeError("item is not type of gara.widgets.TreeItem");
		}

		// set a previous active item inactive
		if (this.activeItem !== null && !this.activeItem.isDisposed()) {
			this.activeItem.setActive(false);
		}

		this.activeItem = item;
		this.activeItem.setActive(true);

		// ARIA reference to the active item
		this.handle.setAttribute("aria-activedescendant", this.activeItem.getId());
	},

	/**
	 * Adds an item to the tree. This is automatically done by instantiating a new item.
	 *
	 * @private
	 * @param {gara.widgets.TreeItem} item the new item to be added
	 * @throws {TypeError}
	 * @returns {HTMLElement} the parent dom node for the new item
	 */
	addItem : function (item, index) {
		var parentItem, previousItem, nextItemIndex, append, getDescendents;
		this.checkWidget();
		if (!(item instanceof gara.widgets.TreeItem)) {
			throw new TypeError("item is not type of gara.widgets.TreeItem");
		}

		parentItem = item.getParentItem();
		getDescendents = function (item) {
			var childs = 0;
			if (item.getItemCount() > 0) {
				item.getItems().forEach(function (child) {
					if (child.getItemCount() > 0) {
						childs += getDescendents(child);
					}
					childs++;
				}, this);
			}
			return childs;
		};

		// root item
		if (parentItem === null) {
			append = typeof(index) === "undefined";

			previousItem = this.rootItems[index];
			if (previousItem) {
				nextItemIndex = getDescendents(previousItem) + 1;
				this.items.insertAt(nextItemIndex, item);
				this.rootItems.insertAt(index, item);
			} else {
				append = true;
			}

			if (append) {
				this.items.push(item);
				this.rootItems.push(item);
			}

		}
		// childs
		else {
			index = this.items.indexOf(parentItem)
				+ getDescendents(parentItem);

			this.items.insertAt(index, item);
		}

		return this.handle;
	},

	/**
	 * Adds the listener to the collection of listeners who will be notified 
	 * when the user changes the receiver's selection, by sending it one of 
	 * the messages defined in the <code>SelectionListener</code> interface. 
	 *
	 * @param {gara.events.SelectionListener} listener the listener which should be notified when the user changes the receiver's selection 
	 * @returns {gara.widgets.Tree} this
	 */
	addSelectionListener : function (listener) {
		this.checkWidget();
		if (!this.selectionListeners.contains(listener)) {
			this.selectionListeners.push(listener);
		}
		return this;
	},
	
	/**
	 * Adds the listener to the collection of listeners who will be notified 
	 * when an item in the receiver is expanded or collapsed by sending it one of 
	 * the messages defined in the <code>TreeListener</code> interface. 
	 *
	 * @param {gara.events.TreeListener} listener the listener which should be notified 
	 * @returns {gara.widgets.Tree} this
	 */
	addTreeListener : function (listener) {
		this.checkWidget();
		if (!this.treeListeners.contains(listener)) {
			this.treeListeners.push(listener);
		}
		return this;
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	bindListener : function (eventType, listener) {
		gara.addEventListener(this.handle, eventType, listener);
	},

	/*
	 * jsdoc in gara.widgets.Control
	 */
	createWidget : function () {
		this.createHandle("ul");
		this.handle.setAttribute("role", "tree");
		this.handle.setAttribute("aria-multiselectable", (this.style & gara.MULTI) === gara.MULTI ? true : false);
		this.handle.setAttribute("aria-activedescendant", this.getId());

		// css
		this.addClass("garaTree");
		this.setClass("garaTreeFullSelection", (this.style & gara.FULL_SELECTION) === gara.FULL_SELECTION);
		this.setClass("garaTreeCheckbox", (this.style & gara.CHECK) === gara.CHECK);
		this.setClass("garaTreeLines", this.showLines);
		this.setClass("garaTreeNoLines", !this.showLines);
		this.setClass("garaBorder", (this.style & gara.BORDER) !== 0);

		// listeners
		this.addListener("mousedown", this);
		this.addListener("contextmenu", this);
		if ((this.style & gara.CHECK) === gara.CHECK) {
			this.addListener("mouseup", this);
		}
	},

	/**
	 * Deselects an item in the receiver.
	 *
	 * @param {gara.widgets.TreeItem} item the item to be deselected
	 * @returns {void}
	 */
	deselect : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.widgets.TreeItem)) {
			throw new TypeError("item is not type of gara.widgets.TreeItem");
		}

		if (this.selection.contains(item)/* && item.getParent() === this*/) {
			item.setSelected(false);
			this.selection.remove(item);
			this.shiftItem = item;
			this.notifySelectionListener();
		}
	},

	/**
	 * Deselects all items in the receiver.
	 *
	 * @returns {void}
	 */
	deselectAll : function () {
		this.checkWidget();
		while (this.selection.length) {
			this.selection.pop().setSelected(false);
		}
		this.notifySelectionListener();
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	destroyWidget : function () {
		this.items = null;
		this.rootItems = null;
		this.activeItem = null;
		this.shiftItem = null;
		this.selection = null;
		this.selectionListeners = null;
		this.treeListeners = null;

		this.$super();
	},

	/**
	 * Focus gained handler
	 * 
	 * @private
	 * @returns {void}
	 */
	focusGained : function () {
		if (this.activeItem === null && this.items.length) {
			this.activateItem(this.items[0]);
		}
	},

	/**
	 * Returns the number of columns contained in the receiver. 
	 * 
	 * @returns {int} the number of columns
	 */
	getColumnCount : function () {
		return 0;
	},

	/**
	 * Returns a specific item at a zero-related index
	 *
	 * @param {int} index the zero-related index
	 * @throws {RangeError} when there is no item at the given index
	 * @returns {gara.widgets.TreeItem} the item
	 */
	getItem : function (index) {
		this.checkWidget();
		if (typeof(this.rootItems.indexOf(index)) === "undefined") {
			throw new RangeError("There is no item for the given index");
		}

		return this.rootItems[index];
	},

	/**
	 * Returns the number of items contained in the receiver that are direct item children of 
	 * the receiver. 
	 *
	 * @returns {int} the number of items
	 */
	getItemCount : function () {
		return this.rootItems.length;
	},

	/**
	 * Returns the height of an item.
	 *
	 * @param {gara.widgets.TreeItem} the item to know the height from
	 * @returns {int} the height of the item
	 */
	getItemHeight : function (item) {
		return item.handle.offsetHeight
				+ gara.getNumStyle(item.handle, "margin-top")
				+ gara.getNumStyle(item.handle, "margin-bottom")
				- (item.childContainer.offsetHeight
					+ gara.getNumStyle(item.childContainer, "margin-top")
					+ gara.getNumStyle(item.childContainer, "margin-bottom"));
	},

	/**
	 * Returns a (possibly empty) array of items contained in the receiver that 
	 * are direct item children of the receiver.
	 *
	 * @returns {gara.widgets.TreeItem[]} the items
	 */
	getItems : function () {
		return this.rootItems;
	},

	/**
	 * Returns whether the receiver's lines are visible or not.
	 *
	 * @returns {boolean} <code>true</code> if the lines are visible and <code>false</code> if they are not
	 */
	getLinesVisible : function () {
		return this.showLines;
	},

	/**
	 * Returns an array of <code>TreeItem</code>s that are currently selected in the receiver. 
	 *
	 * @returns {gara.widgets.TreeItem[]} the selected items
	 */
	getSelection : function () {
		return this.selection;
	},

	/**
	 * Returns the number of selected items contained in the receiver.
	 *
	 * @returns {int} the number of selected items
	 */
	getSelectionCount : function () {
		return this.selection.length;
	},

	/**
	 * Returns a <code>TreeItem</code> which is currently at the top of the receiver. This 
	 * <code>TreeItem</code> can change when items are scrolled or new items are added or removed.
	 *  
	 * @returns {gara.widgets.TreeItem} the top item
	 */
	getTopItem : function () {
		var h, i, scrollTop;
		if (!this.items.length) {
			return null;
		}

		scrollTop = this.scrolledHandle().scrollTop;
		h = 0;
		for (i = 0; i < this.items.length; i++) {
			h += this.getItemHeight(this.items[i]);
			if (h > scrollTop) {
				return this.items[i];
			}
		}
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	handleEvent : function (e) {
		var widget;
		this.checkWidget();

		// special events for the list
		widget = e.target.widget || null;
		e.item = widget && widget instanceof gara.widgets.TreeItem ? widget : this.activeItem;
		e.widget = this;
		this.event = e;

		this.handleMouseEvents(e);
		if (this.menu !== null && this.menu.isVisible()) {
			this.menu.handleEvent(e);
		} else {
			this.handleKeyEvents(e);
			this.handleMenu(e);
		}

		this.$super(e);

		if (e.item !== null) {
			e.item.handleEvent(e);
		}

		if (e.type === "contextmenu") {
			e.preventDefault();
		}
		
		e.stopPropagation();
		/* in case of ie6, it is necessary to return false while the type of
		 * the event is "contextmenu" and the menu isn't hidden in ie6
		 */
		return false;
	},

	/**
	 * Handles the receiver's mouse events
	 * 
	 * @private
	 * @param {Event} e
	 * @returns {void}
	 */
	handleMouseEvents : function (e) {
		var item = e.item;
		if (e.type === "mousedown") {
			if (item !== null) {
				if (e.ctrlKey && !e.shiftKey) {
					if (this.selection.contains(item)) {
						this.deselect(item);
					} else {
						this.selectAdd(item, true);
					}
				} else if (!e.ctrlKey && e.shiftKey) {
					this.selectShift(item, false);
				} else if (e.ctrlKey && e.shiftKey) {
					this.selectShift(item, true);
				} else {
					this.selectAdd(item, false);
				}
				this.activateItem(item);
			}
		}
	},

	/**
	 * Handles the receiver's keyboard events
	 * 
	 * @private
	 * @param {Event} e
	 * @returns {void}
	 */
	handleKeyEvents : function (e) {
		switch (e.type) {
		case "keyup":
		case "keydown":
		case "keypress":
			if (e.type === "keydown") {
				this.handleKeyNavigation(e);
			}

			// prevent default when scrolling keys are used
			this.preventScrolling(e);
			break;
		}
	},

	/**
	 * Handles the receiver's keyboard navigation
	 *
	 * @private
	 * @param {Event} W3C-Event
	 * @returns {void}
	 */
	handleKeyNavigation : function (e) {
		var prev, siblings, parentWidget, sibOffset, prevSibling, h, i, viewport,
			itemAddition, next, activeIndex, scrollRange, min, buffer, getLastItem, countItems;

		getLastItem = function (item) {
			if (item.getExpanded() && item.getItemCount() > 0) {
				return getLastItem(item.getItems()[item.getItemCount() - 1]);
			} else {
				return item;
			}
		};

		countItems = function(item) {
			var items = 0, i,
				childs = item.getItems();

			for (i = 0; i < childs.length; ++i) {
				items++;
				if (childs[i].getItemCount() > 0) {
					items += countItems(childs[i]);
				}
			}

			return items;
		};

		switch (e.keyCode) {

		// up
		case gara.ARROW_UP:

			// determine previous item
			if (this.activeItem === this.items[0]) {
				// item is root;
				prev = false;
			} else {
				parentWidget = this.activeItem.getParentItem();
				if (parentWidget === null) {
					siblings = this.rootItems;
				} else {
					siblings = parentWidget.getItems();
				}
				sibOffset = siblings.indexOf(this.activeItem);

				// prev item is parent
				if (sibOffset === 0) {
					prev = parentWidget;
				} else {
					prevSibling = siblings[sibOffset - 1];
					prev = getLastItem(prevSibling);
				}
			}

			if (prev) {
				// update scrolling
				h = 0;
				activeIndex = this.items.indexOf(this.activeItem);
				for (i = 0; i < (activeIndex - 1); i++) {
					h += this.getItemHeight(this.items[i]);
				}
				viewport = this.handle.clientHeight + this.handle.scrollTop
					- gara.getNumStyle(this.handle, "padding-top")
					- gara.getNumStyle(this.handle, "padding-bottom");
				itemAddition = this.getItemHeight(prev);

				this.handle.scrollTop = h < this.handle.scrollTop ? h : (viewport < h ? h - viewport + itemAddition : this.handle.scrollTop);

				// handle select
				if (!e.ctrlKey && !e.shiftKey) {
					this.activateItem(prev);
					this.selectAdd(prev, false);
				} else if (e.ctrlKey && e.shiftKey) {
					this.activateItem(prev);
					this.selectShift(prev, true);
				} else if (e.shiftKey) {
					this.activateItem(prev);
					this.selectShift(prev, false);
				} else if (e.ctrlKey) {
					this.activateItem(prev);
				}
			}
			break;

		// down
		case gara.ARROW_DOWN:

			// determine next item
			// item is last;
			if (this.activeItem === this.items[this.items.length - 1]) {
				next = false;
			} else {
				parentWidget = this.activeItem.getParentItem();
				if (parentWidget === null) {
					siblings = this.rootItems;
				} else {
					siblings = parentWidget.getItems();
				}
				sibOffset = siblings.indexOf(this.activeItem);

				if (this.activeItem.getItemCount() > 0 && this.activeItem.getExpanded()) {
					next = this.activeItem.getItems()[0];
				} else if (this.activeItem.getItemCount() > 0 && !this.activeItem.getExpanded()) {
					next = this.items[this.items.indexOf(this.activeItem) + countItems(this.activeItem) + 1];
				} else {
					next = this.items[this.items.indexOf(this.activeItem) + 1];
				}
			}

			if (next) {
				// update scrolling
				h = 0;
				activeIndex = this.items.indexOf(this.activeItem);
				for (i = 0; i <= (activeIndex + 1); i++) {
					h+= this.getItemHeight(this.items[i]);
				}
				min = h - this.getItemHeight(next);
				viewport = this.handle.clientHeight + this.handle.scrollTop
					- gara.getNumStyle(this.handle, "padding-top")
					- gara.getNumStyle(this.handle, "padding-bottom");
				scrollRange = h - this.handle.clientHeight
					+ gara.getNumStyle(this.handle, "padding-top")
					+ gara.getNumStyle(this.handle, "padding-bottom");

				this.handle.scrollTop = h > viewport ? (scrollRange) : (this.handle.scrollTop > min ? min : this.handle.scrollTop);


				// handle select
				if (!e.ctrlKey && !e.shiftKey) {
					this.activateItem(next);
					this.selectAdd(next, false);
				} else if (e.ctrlKey && e.shiftKey) {
					this.activateItem(next);
					this.selectShift(next, true);
				} else if (e.shiftKey) {
					this.activateItem(next);
					this.selectShift(next, false);
				} else if (e.ctrlKey) {
					this.activateItem(next);
				}
			}
			break;

		// left - collapse tree
		case gara.ARROW_LEFT:
			buffer = this.activeItem;
			this.activeItem.setExpanded(false);
			this.activateItem(buffer);
			break;

		// right - expand tree
		case gara.ARROW_RIGHT:
			this.activeItem.setExpanded(true);
			break;

		// space
		case gara.SPACE:
			this.activeItem.setChecked(!this.activeItem.getChecked());
			if (this.selection.contains(this.activeItem) && e.ctrlKey) {
				this.deselect(this.activeItem);
			} else {
				this.selectAdd(this.activeItem, true);
			}
			break;

		// home
		case gara.HOME:
			this.handle.scrollTop = 0;

			if (!e.ctrlKey && !e.shiftKey) {
				this.activateItem(this.items[0]);
				this.selectAdd(this.items[0], false);
			} else if (e.shiftKey) {
				this.activateItem(this.items[0]);
				this.selectShift(this.items[0], false);
			} else if (e.ctrlKey) {
				this.activateItem(this.items[0]);
			}
			break;

		// end
		case gara.END:
			this.handle.scrollTop = this.handle.scrollHeight - this.handle.clientHeight;

			if (!e.ctrlKey && !e.shiftKey) {
				this.activateItem(this.items[this.items.length-1]);
				this.selectAdd(this.items[this.items.length-1], false);
			} else if (e.shiftKey) {
				this.activateItem(this.items[this.items.length-1]);
				this.selectShift(this.items[this.items.length-1], false);
			} else if (e.ctrlKey) {
				this.activateItem(this.items[this.items.length-1]);
			}
			break;
		}
	},

	/**
	 * Searches the receiver's list starting at the first item (index 0) until an item is found that 
	 * is equal to the argument, and returns the index of that item. 
	 *
	 * @param {gara.widgets.TreeItem} item the item to look for
	 * @throws {TypeError} if the item is not a <code>TreeItem</code>
	 * @returns {int} the index of the specified item or -1 if it does not exist
	 */
	indexOf : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.widgets.TreeItem)) {
			throw new TypeError("item not instance of gara.widgets.TreeItem");
		}

		return this.rootItems.indexOf(item);
	},

	/**
	 * Notifies all selection listeners about the selection change
	 *
	 * @private
	 * @returns {void}
	 */
	notifySelectionListener : function () {
		this.selectionListeners.forEach(function (listener) {
			if (listener.widgetSelected) {
				listener.widgetSelected(this.event);
			}
		}, this);
	},
	
	/**
	 * Notifies all tree listeners about a specific event.
	 * 
	 * @private
	 * @param {String} eventType the event
	 * @returns {boolean} true if the operation is permitted
	 */
	notifyTreeListener : function (eventType, item) {
		var ret = true, 
			e = this.event || window.event || {};
			e.widget = this;
			e.control = this;
			e.item = item;
			
		this.treeListeners.forEach(function (listener) {
			var answer;

			if (listener[eventType]) {
				answer = listener[eventType](e);
				if (typeof(answer) !== "undefined") {
					ret = answer;
				}
			}
		}, this);
		return ret;
	},

	/*
	 * jsdoc in gara.widgets.Composite 
	 */
	releaseChildren : function () {
		this.rootItems.forEach(function (item) {
			item.release();
		}, this);

		this.$super();
	},
	
	/**
	 * Releases an item from the receiver
	 *
	 * @private
	 * @param {gara.widgets.TreeItem} item the item that should removed from the receiver
	 * @returns {void}
	 */
	releaseItem : function (item) {
		if (this.items.contains(item)) {
			if (this.rootItems.contains(item)) {
				this.handle.removeChild(item.handle);
			}
			this.items.remove(item);
			this.rootItems.remove(item);
			this.selection.remove(item);
		}
	},

	/**
	 * Removes an item from the receiver.
	 *
	 * @private
	 * @param {gara.widgets.TreeItem} item the item that should be removed
	 * @returns {void}
	 */
	removeItem : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.widgets.TreeItem)) {
			throw new TypeError("item not instance of gara.widgets.TreeItem");
		}

		this.items.remove(item);
		this.rootItems.remove(item);
	},

	/**
	 * Removes all items from the receiver.
	 *
	 * @returns {void}
	 */
	removeAll : function () {
		this.checkWidget();
		this.items = [];
		this.rootItems = [];
	},

	/**
	 * Removes the listener from the collection of listeners who will be notified 
	 * when the user changes the receiver's selection. 
	 *
	 * @param {gara.widgets.SelectionListener} listener the listener which should no longer be notified 
	 * @returns {gara.widgets.Tree} this
	 */
	removeSelectionListener : function (listener) {
		this.checkWidget();
		this.selectionListeners.remove(listener);
		return this;
	},
	
	/**
	 * Removes the listener from the collection of listeners who will be notified 
	 * when items in the receiver are expanded or collapsed. 
	 *
	 * @param {gara.widgets.TreeListener} listener the listener which should no longer be notified 
	 * @returns {gara.widgets.Tree} this
	 */
	removeTreeListener : function (listener) {
		this.checkWidget();
		this.treeListeners.remove(listener);
		return this;
	},

	/**
	 * Selects a specific item
	 *
	 * @private
	 * @param {gara.widgets.TreeItem} item the item to select
	 * @param {boolean} _add true for adding to the current selection, false will select only this item
	 * @throws {TypeError} if the item is not a TreeItem
	 * @returns {void}
	 */
	selectAdd : function (item, add) {
		var i;
		this.checkWidget();
		if (!(item instanceof gara.widgets.TreeItem)) {
			throw new TypeError("item is not type of gara.widgets.TreeItem");
		}

		if (!add || (this.style & gara.MULTI) !== gara.MULTI) {
			while (this.selection.length) {
				i = this.selection.pop();
				i.setSelected(false);
			}
		}

		if (!this.selection.contains(item)) {
			item.setSelected(true);
			this.selection.push(item);
			this.shiftItem = item;
			this.notifySelectionListener();
		}
	},

	/**
	 * Select all items in the receiver.
	 *
	 * @returns {void}
	 */
	selectAll : function () {
		this.checkWidget();
		if ((this.style & gara.SINGLE) !== gara.SINGLE) {
			this.items.forEach(function (item){
				if (!this.selection.contains(item)) {
					this.selection.push(item);
					item.setSelected(true);
				}
			}, this);
			this.notifySelectionListener();
		}
	},

	/**
	 * Selects a Range of items. From shiftItem to the passed item.
	 *
	 * @private
	 * @returns {void}
	 */
	selectShift : function (item, add) {
		var i, indexShift, indexItem, from, to;
		this.checkWidget();
		if (!(item instanceof gara.widgets.TreeItem)) {
			throw new TypeError("item is not type of gara.widgets.TreeItem");
		}

		if (!add) {
			while (this.selection.length) {
				i = this.selection.pop();
				i.setSelected(false);
			}
		}

		if ((this.style & gara.MULTI) === gara.MULTI) {
			indexShift = this.items.indexOf(this.shiftItem);
			indexItem = this.items.indexOf(item);
			from = indexShift > indexItem ? indexItem : indexShift;
			to = indexShift < indexItem ? indexItem : indexShift;

			for (i = from; i <= to; ++i) {
				this.selection.push(this.items[i]);
				this.items[i].setSelected(true);
			}

			this.notifySelectionListener();
		} else {
			this.selectAdd(item);
		}
	},

	/**
	 * Sets lines visible or invisible.
	 *
	 * @param {boolean} show <code>true<code> if the lines should be visible or <code>false</code> for invisibility
	 * @returns {gara.widgets.Tree} this
	 */
	setLinesVisible : function (show) {
		this.showLines = show;
		this.setClass("garaTreeLines", this.showLines);
		return this;
	},

	/**
	 * Sets the receiver's selection to the given item or array of items.
	 *
	 * @param {gara.widgets.TreeItem[]|gara.widgets.TreeItem} items the array with the <code>TreeItem</code> items
	 * @returns {gara.widgets.Tree} this
	 */
	setSelection : function (items) {
		var item;
		this.checkWidget();

		while (this.selection.length) {
			item = this.selection.pop();
			if (!item.isDisposed()) {
				item.setSelected(false);
			}
		}

		if (items instanceof Array) {
			if (items.length > 1 && (this.style & gara.MULTI) === gara.MULTI) {
				items.forEach(function (item) {
					if (!this.selection.contains(item)) {
						item.setSelected(true);
						this.selection.push(item);
					}
				}, this);
				this.notifySelectionListener();
			} else if (items.length) {
				this.selectAdd(items[items.length - 1], true);
			}
		} else if (gara.instanceOf(items, gara.widgets.ListItem)) {
			this.selectAdd(this.indexOf(items), true);
		}
		return this;
	},

	/**
	 * Sets the topmost item.
	 * 
	 * @see gara.widgets.Tree#getTopItem
	 * @param {gara.widgets.TreeItem} item the new top item
	 * @returns {gara.widgets.Tree} this
	 */
	setTopItem : function (item) {
		var index, h, i;
		if (!(item instanceof gara.widgets.TreeItem)) {
			throw new TypeError("item not instance of gara.widgets.TreeItem");
		}

		index = this.items.indexOf(item);
		h = 0;
		for (i = 0; i < index; i++) {
			h += this.getItemHeight(this.items[i]);
		}

		this.scrolledHandle().scrollTop = h;
		return this;
	},

//	setWidth : function (width) {
//		console.log("Tree.setWidth (padding-left)" + gara.Utils.getStyle(this.handle, "padding-left"));
//		console.log("Tree.setWidth (padding-right)" + gara.Utils.getStyle(this.handle, "padding-right"));
//		console.log("Tree.setWidth (border-left-width)" + gara.Utils.getStyle(this.handle, "border-left-width"));
//		console.log("Tree.setWidth (border-right-width)" + gara.Utils.getStyle(this.handle, "border-right-width"));
//		this.$super(width);
//		console.log("Tree.setWidth: " + width);
//		return this;
//	},

	/**
	 * Scrolls the receiver that the passed item is visible.
	 * 
	 * @param {gara.widgets.TreeItem} item 
	 * @returns {void}
	 */
	showItem : function (item) {
		var index, h, i, newScrollTop;
		if (!(item instanceof gara.widgets.TreeItem)) {
			throw new TypeError("item not instance of gara.widgets.TreeItem");
		}

		if (this.getVerticalScrollbar()) {
			index = this.items.indexOf(item);
			h = 0;
			for (i = 0; i <= index; i++) {
				h += this.getItemHeight(this.items[i]);
			}

			if ((this.scrolledHandle().scrollTop + this.scrolledHandle().clientHeight) < h
					|| this.scrolledHandle().scrollTop > h) {
				newScrollTop = h - Math.round(this.getItemHeight(this.items[index]) / 2) - Math.round(this.scrolledHandle().clientHeight / 2);
				this.scrolledHandle().scrollTop = newScrollTop;
			}
		}
	},

	/**
	 * Scrolls the receiver that the selection is visible.
	 * 
	 * @see gara.widgets.Tree#showItem
	 * @returns {void}
	 */
	showSelection : function () {
		if (this.selection.length) {
			this.showItem(this.selection[0]);
		}
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	unbindListener : function (eventType, listener) {
		gara.removeEventListener(this.handle, eventType, listener);
	},

	/**
	 * Updates the receiver, remeasures the receiver. Removing disposed items, updates the others.
	 *
	 * @returns {void}
	 */
	update : function () {
		var i = 0, item,
			len = this.rootItems.length;

		this.checkWidget();

		// measurements
		this.handle.style.width = this.width !== null ? (this.width - gara.getNumStyle(this.handle, "padding-left") - gara.getNumStyle(this.handle, "padding-right") - gara.getNumStyle(this.handle, "border-left-width") - gara.getNumStyle(this.handle, "border-right-width")) + "px" : "auto";
		this.handle.style.height = this.height !== null ? (this.height - gara.getNumStyle(this.handle, "padding-top") - gara.getNumStyle(this.handle, "padding-bottom") - gara.getNumStyle(this.handle, "border-top-width") - gara.getNumStyle(this.handle, "border-bottom-width")) + "px" : "auto";

		// update items
		while (i < len) {
			item = this.rootItems[i];
			if (item.isDisposed()) {
				this.removeItem(item);
				len--;
			} else {
				item.update();
				i++;
			}
		}
	}
};});