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

gara.provide("gara.widgets.List", "gara.widgets.Composite");

gara.use("gara.widgets.ListItem");

/**
 * gara List Widget
 *
 * @description
 * long description for the List Widget...
 *
 * @class gara.widgets.List
 * @extends gara.widgets.Composite
 */
gara.Class("gara.widgets.List", function () { return /** @lends gara.widgets.List# */ {
	$extends : gara.widgets.Composite,

	/**
	 * Contains a reference to the active item.
	 *
	 * @private
	 * @type {gara.widgets.ListItem}
	 */
	activeItem : null,

	/**
	 * Contains the items.
	 *
	 * @private
	 * @type {gara.widgets.ListItem[]}
	 */
	items : [],

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
	 * Contains the item that was active when shift was pressed.
	 *
	 * @private
	 * @type {gara.widgets.ListItem}
	 */
	shiftItem : null,

	/**
	 * @constructs
	 * @extends gara.widgets.Composite
	 * @param {gara.widgets.Composite|HTMLElement} parent parent dom node or composite
	 * @param {int} style The style for the list
	 */
	$constructor : function (parent, style) {
		this.items = [];

		this.activeItem = null;
		this.shiftItem = null;

		this.selection = [];
		this.selectionListeners = [];

		this.$super(parent, style || gara.SINGLE);
		this.addFocusListener(this);
	},

	/**
	 * Activates an item
	 *
	 * @private
	 * @param {gara.widgets.ListItem} item the item that should added to the List
	 * @throws {TypeError} if the item is not a ListItem
	 * @returns {void}
	 */
	activateItem : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.widgets.ListItem)) {
			throw new TypeError("item is not type of gara.widgets.ListItem");
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
	 * Adds an item to the list (invoked by the constructor of ListItem)
	 *
	 * @private
	 * @param {gara.widgets.ListItem} item the item that should added to the List
	 * @throws {TypeError} if the item is not a gara.widgets.ListItem
	 * @returns {void}
	 */
	addItem : function (item, index) {
		this.checkWidget();
		if (!(item instanceof gara.widgets.ListItem)) {
			throw new TypeError("item is not type of gara.widgets.ListItem");
		}

		if (typeof(index) !== "undefined") {
			this.items.insertAt(index, item);
		} else {
			this.items.push(item);
		}

		return this.handle;
	},

	/**
	 * Adds the listener to the collection of listeners who will be notified 
	 * when the user changes the receiver's selection, by sending it one of 
	 * the messages defined in the <code>SelectionListener</code> interface. 
	 *
	 * @param {gara.events.SelectionListener} listener the listener which should be notified when the user changes the receiver's selection 
	 * @returns {gara.widgets.List} this
	 */
	addSelectionListener : function (listener) {
		this.checkWidget();
		if (!this.selectionListeners.contains(listener)) {
			this.selectionListeners.add(listener);
		}
		return this;
	},

	/**
	 * Register listeners for this widget. Implementation for gara.widgets.Widget
	 *
	 * @private
	 * @returns {void}
	 */
	bindListener : function (eventType, listener) {
		gara.addEventListener(this.handle, eventType, listener);
	},

	/**
	 * @private
	 */
	createWidget : function () {
		this.createHandle("ul");

		this.handle.setAttribute("role", "listbox");
		this.handle.setAttribute("aria-multiselectable", (this.style & gara.MULTI) === gara.MULTI ? true : false);
		this.handle.setAttribute("aria-activedescendant", this.getId());

		// add css classes
		this.addClass("garaList");
		this.setClass("garaListFullSelection", (this.style & gara.FULL_SELECTION) === gara.FULL_SELECTION);
		this.setClass("garaListCheckbox", (this.style & gara.CHECK) === gara.CHECK);
		this.setClass("garaBorder", (this.style & gara.BORDER) !== 0);

		// listeners
		this.addListener("mousedown", this);
		if ((this.style & gara.CHECK) === gara.CHECK) {
			this.addListener("mouseup", this);
		}
	},

	/**
	 * Deselects an item.
	 *
	 * @param {int} index item at zero-related index that should be deselected
	 * @throws {RangeError} when there is no item at the given index
	 * @returns {void}
	 */
	deselect : function (index) {
		var item;
		this.checkWidget();

		// return if index are out of bounds
		if (typeof(this.items.indexOf(index)) === "undefined") {
			throw new RangeError("There is no item for the given index");
		}

		item = this.items[index];
		if (this.selection.contains(item)) {
			item.setSelected(false);
			this.selection.remove(item);
			this.shiftItem = item;
			this.notifySelectionListener();
		}
	},

	/**
	 * Deselects all items of the receiver.
	 *
	 * @returns {void}
	 */
	deselectAll : function () {
		var item;
		this.checkWidget();
		if (this.selection.length) {
			while (this.selection.length) {
				item = this.selection.pop();
				item.setSelected(false);
			}
			this.notifySelectionListener();
		}
	},

	/**
	 * Deselects items which indices passed as an array.
	 * 
	 * @param {int[]} indices an array with zero-related indices
	 * @returns {void}
	 */
	deselectArray : function (indices) {
		if (this.selection.length) {
			indices.forEach(function (index) {
				if (index < 0 || index >= this.items.length) {
					return;
				}
				this.items[index].setSelected(false);
			}, this);
			this.notifySelectionListener();
		}
	},

	/**
	 * Deselects a range of items.
	 * 
	 * @param {int} from
	 * @param {int} to
	 * @returns {void}
	 */
	deselectRange : function (from, to) {
		for (var i = from; i <= to; i++) {
			this.items[i].setSelected(false);
		}
		this.notifySelectionListener();
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	destroyWidget : function () {
		this.items = null;

		this.activeItem = null;
		this.shiftItem = null;

		this.selection = null;
		this.selectionListeners = null;
		
		this.$super();
	},
	
	/**
	 * Removes an item from the receiver
	 *
	 * @private
	 * @param {gara.widgets.ListItem} item the item that should removed from the receiver
	 * @returns {void}
	 */
	destroyItem : function (item) {
		if (this.items.contains(item)) {
			this.items.remove(item);
			this.handle.removeChild(item.handle);
		}
	},

	/**
	 * Focus listener. Will be notified when the receiver gets focussed.
	 * 
	 * @private
	 * @param {Event} e
	 * @returns {void}
	 */
	focusGained : function (e) {
		// mark first item active
		if (this.activeItem === null && this.items.length) {
			this.activateItem(this.items[0]);
		}
	},

	/**
	 * Get a specified item with a zero-related index.
	 *
	 * @param {int} index the zero-related index
	 * @throws {RangeError} when there is no item at the given index
	 * @returns {gara.widgets.ListItem} the item
	 */
	getItem : function (index) {
		this.checkWidget();
		if (typeof(this.items.indexOf(index)) === "undefined") {
			throw new RangeError("There is no item for the given index");
		}

		return this.items[index];
	},

	/**
	 * Returns the amount of the items in the receiver.
	 *
	 * @returns {int} the amount
	 */
	getItemCount : function () {
		return this.items.length;
	},

	/**
	 * Returns the items height.
	 * 
	 * @private
	 * @param {gara.widgets.Item} item
	 * @returns {int} the height
	 */
	getItemHeight : function (item) {
		return item.handle.offsetHeight
			+ gara.getNumStyle(item.handle, "margin-top")
			+ gara.getNumStyle(item.handle, "margin-bottom");
	},

	/**
	 * Returns an array with all the items in the list
	 *
	 * @returns {gara.widgets.ListItem[]} the array with the items
	 */
	getItems : function () {
		this.checkWidget();
		return this.items;
	},

	/**
	 * Returns an array with the items which are currently selected in the list
	 *
	 * @returns {gara.widgets.ListItem[]} an array with items
	 */
	getSelection : function () {
		this.checkWidget();
		return this.selection;
	},

	/**
	 * Returns the amount of the selected items in the tree
	 *
	 * @returns {int} the amount
	 */
	getSelectionCount : function () {
		this.checkWidget();
		return this.selection.length;
	},

	/**
	 * Returns a <code>ListItem</code> which is currently at the top of the receiver. This 
	 * <code>ListItem</code> can change when items are scrolled or new items are added or removed.
	 *  
	 * @returns {gara.widgets.ListItem} the top item
	 */
	getTopItem : function () {
		this.checkWidget();
		var scrollTop, h, i;

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

	/**
	 * Handles events on the list. Implements DOMEvent Interface by the W3c.
	 *
	 * @private
	 * @param {Event} e event the users triggers
	 * @returns {void}
	 */
	handleEvent : function (e) {
		var widget;
		this.checkWidget();

		// special events for the list
		widget = e.target.widget || null;
		e.item = widget && widget instanceof gara.widgets.ListItem ? widget : this.activeItem;
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
	 * @private
	 */
	handleMouseEvents : function (e) {
		var item = e.item;
		if (e.type === "mousedown") {
			if (item !== null) {
				this.activateItem(item);
				if (!e.ctrlKey && !e.shiftKey) {
					this.selectAdd(item, false);
				} else if (e.ctrlKey && e.shiftKey) {
					this.selectShift(item, true);
				} else if (e.shiftKey) {
					this.selectShift(item, false);
				} else if (e.ctrlKey) {
					if (this.selection.contains(item)) {
						this.deselect(this.indexOf(item));
					} else {
						this.select(this.indexOf(item), true);
					}
				} else {
					this.select(this.indexOf(item));
				}
			}
		}
	},

	/**
	 * @private
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
	 * Handling key events on the receiver.
	 *
	 * @private
	 * @param {Event} e event the users triggers
	 * @returns {void}
	 */
	handleKeyNavigation : function (e) {
		var prev, next, activeIndex, i, h, viewport, itemAddition, min, lastOffset, scrollRange;
		switch (e.keyCode) {

		// left and up
		case gara.ARROW_LEFT:
		case gara.ARROW_UP:

			// determine previous item
			prev = false;
			activeIndex = this.indexOf(this.activeItem);

			if (activeIndex !== 0) {
				prev = this.items[activeIndex - 1];
			}

			if (prev) {
				// update scrolling
				h = 0;
				for (i = 0; i < (activeIndex - 1); i++) {
					h += this.getItemHeight(this.items[i]);
				}
				viewport = this.handle.clientHeight + this.handle.scrollTop
					- gara.getNumStyle(this.handle, "padding-top")
					- gara.getNumStyle(this.handle, "padding-bottom");
				itemAddition = prev.handle.clientHeight
					- gara.getNumStyle(prev.handle, "padding-top")
					- gara.getNumStyle(prev.handle, "padding-bottom");

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

		// right and down
		case gara.ARROW_RIGHT:
		case gara.ARROW_DOWN:

			// determine next item
			next = false;
			activeIndex = this.indexOf(this.activeItem);

			// item is last;
			if (activeIndex !== this.items.length - 1) {
				next = this.items[activeIndex + 1];
			}

			if (next) {
				// update scrolling
				h = 0;
				for (i = 0; i <= (activeIndex + 1); i++) {
					h += this.getItemHeight(this.items[i]);
				}
				min = h - this.getItemHeight(next);
				viewport = this.handle.clientHeight + this.handle.scrollTop
					- gara.getNumStyle(this.handle, "padding-top")
					- gara.getNumStyle(this.handle, "padding-bottom");
				scrollRange = h - this.handle.clientHeight
					+ gara.getNumStyle(this.handle, "padding-top")
					+ gara.getNumStyle(this.handle, "padding-bottom");

				this.handle.scrollTop = h > viewport ? (scrollRange < 0 ? 0 : scrollRange) : (this.handle.scrollTop > min ? min : this.handle.scrollTop);

				// handle select and active item
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

		// space
		case gara.SPACE:

			if ((this.style & gara.CHECK) === gara.CHECK) {
				this.activeItem.setChecked(!this.activeItem.getChecked());
			}

			// handle select and active item
			if (this.selection.contains(this.activeItem) && e.ctrlKey) {
				this.deselect(this.indexOf(this.activeItem));
			} else {
				this.selectAdd(this.activeItem, true);
			}
			break;

		// home
		case gara.HOME:

			// update scrolling
			this.handle.scrollTop = 0;

			// handle select and active item
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

			// update scrolling
			this.handle.scrollTop = this.handle.scrollHeight - this.handle.clientHeight;

			// handle select and active item
			lastOffset = this.items.length - 1;
			if (!e.ctrlKey && !e.shiftKey) {
				this.activateItem(this.items[lastOffset]);
				this.selectAdd(this.items[lastOffset], false);
			} else if (e.shiftKey) {
				this.activateItem(this.items[lastOffset]);
				this.selectShift(this.items[lastOffset], false);
			} else if (e.ctrlKey) {
				this.activateItem(this.items[lastOffset]);
			}
			break;

		// ctrl+a
		case 65:
			if (e.ctrlKey) {
				this.selectAll();
			}
			break;
		}
	},

	/**
	 * Looks for the index of a specified item.
	 *
	 * @param {gara.widgets.ListItem} item the item for the index
	 * @throws {TypeError} if the item is not a ListItem
	 * @returns {int} the index of the specified item
	 */
	indexOf : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.widgets.ListItem)) {
			throw new TypeError("item not instance of gara.widgets.ListItem");
		}

		return this.items.indexOf(item);
	},

	/**
	 * Notifies selection listener about the changed selection within the receiver.
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
	 * Releases all children from the receiver.
	 *
	 * @private
	 * @returns {void}
	 */
	releaseChildren : function () {
		this.items.forEach(function (item) {
			item.release();
		}, this);
		
		this.$super();
	},
	
	/**
	 * Releases an item from the receiver.
	 *
	 * @private
	 * @param {gara.widgets.TableItem} item the item that should removed from the receiver
	 * @returns {void}
	 */
	releaseItem : function (item) {
		if (this.items.contains(item)) {
			this.handle.removeChild(item.handle);
			this.items.remove(item);
			this.selection.remove(item);
		}
	},

	/**
	 * Removes an item from the receiver.
	 *
	 * @param {int} index the index of the item
	 * @throw {RangeError} if the index is out of bounds
	 * @returns {void}
	 */
	remove : function (index) {
		var item;
		this.checkWidget();
		if (index < 0 || index > this.items.length) {
			throw new RangeError("index out of bounds");
		}
		item = this.items.removeAt(index)[0];
		this.selection.remove(item);
		item.dispose();
	},

	/**
	 * Removes all items from the receiver.
	 *
	 * @returns {void}
	 */
	removeAll : function () {
		this.checkWidget();
		while (this.items.length) {
			this.remove(0);
		}
	},
	
	/**
	 * Removes items which indices are passed as an array.
	 *
	 * @param {int[]} indices the array with the indices
	 * @returns {void}
	 */
	removeArray : function (indices) {
		this.checkWidget();
		indices.forEach(function (item, index, arr) {
			this.remove(index);
		}, this);
	},
	
	/**
	 * Removes items within an indices range.
	 *
	 * @param {int} start start index
	 * @param {int} end end index
	 * @returns {void}
	 */
	removeRange : function (start, end) {
		var i;
		this.checkWidget();
		for (i = start; i <= end; ++i) {
			this.remove(start);
		}
	},

	/**
	 * Removes the listener from the collection of listeners who will no longer be notified 
	 * when the user changes the receiver's selection. 
	 *
	 * @param {gara.widgets.SelectionListener} listener the listener which should no longer be notified 
	 * @returns {gara.widgets.List} this
	 */
	removeSelectionListener : function (listener) {
		this.checkWidget();
		this.selectionListeners.remove(listener);
		return this;
	},

	/**
	 * Selects an item.
	 *
	 * @see gara.widgets.List#selectAll
	 * @see gara.widgets.List#selectArray
	 * @see gara.widgets.List#selectRange
	 * @see gara.widgets.List#setSelection
	 * @param {int} item the item that should be selected
	 * @throws {RangeError} if the index is out of bounds
	 * @returns {void}
	 */
	select : function (index) {
		var item;
		this.checkWidget();

		// return if index are out of bounds
		if (index < 0 || index >= this.items.length) {
			throw new RangeError("index out of bounds");
		}

		item = this.items[index];
		if (!this.selection.contains(item)) {
			item.setSelected(true);
			this.selection.push(item);
			this.shiftItem = item;
			this.notifySelectionListener();
		}
	},

	/**
	 * @private
	 */
	selectAdd : function (item, add) {
		var i;
		this.checkWidget();
		
		if (!(item instanceof gara.widgets.ListItem)) {
			throw new TypeError("item not instance of gara.widgets.ListItem");
		}

		if (!add || (this.style & gara.MULTI) !== gara.MULTI) {
			while (this.selection.length) {
				i = this.selection.pop();
				i.setSelected(false);
			}
		}

		this.select(this.indexOf(item));
	},

	/**
	 * Select all items in the receiver.
	 * 
	 * @description
	 * Select all items in the receiver. If the receiver is single-select, do nothing. 
	 * 
	 * @see gara.widgets.List#select
	 * @see gara.widgets.List#selectArray
	 * @see gara.widgets.List#selectRange
	 * @see gara.widgets.List#setSelection
	 * @returns {void}
	 */
	selectAll : function () {
		this.checkWidget();
		if ((this.style & gara.MULTI) === gara.MULTI) {
			this.items.forEach(function (item) {
				if (!this.selection.contains(item)) {
					item.setSelected(true);
					this.selection.push(item);
				}
			}, this);
			this.notifySelectionListener();
		}
	},

	/**
	 * Selects items passed by an array with zero-related indices.
	 * 
	 * @see gara.widgets.List#select
	 * @see gara.widgets.List#selectAll
	 * @see gara.widgets.List#selectRange
	 * @see gara.widgets.List#setSelection
	 * @param {int[]} indices an array with zero-related indices
	 * @returns {void}
	 */
	selectArray : function (indices) {
		if (!indices.length) {
			return;
		}
		this.checkWidget();

		if (indices.length > 1 && (this.style & gara.MULTI) === gara.MULTI) {
			indices.forEach(function (index) {
				if (!this.selection.contains(this.items[index])) {
					this.items[index].setSelected(true);
					this.selection.push(this.items[index]);
				}
			}, this);
			this.notifySelectionListener();
		} else {
			this.select(indices[indices.length - 1]);
		}
	},

	/**
	 * Selects items within a specified range.
	 *
	 * @see gara.widgets.List#select
	 * @see gara.widgets.List#selectAll
	 * @see gara.widgets.List#selectArray
	 * @see gara.widgets.List#setSelection
	 * @param {int} from range start
	 * @param {int} to range end
	 * @returns {void}
	 */
	selectRange : function (from, to) {
		var i;
		this.checkWidget();
		
		if ((to - from) > 1 && (this.style & gara.MULTI) === gara.MULTI) {
			for (i = from; i <= to; i++) {
				if (!this.selection.contains(this.items[i])) {
					this.items[i].setSelected(true);
					this.selection.push(this.items[i]);
				}
			}
			this.notifySelectionListener();
		} else {
			this.select(to);
		}
	},

	/**
	 * Selects a range. From the item with shift-lock to the passed item.
	 *
	 * @private
	 * @param {gara.widgets.ListItem} item the item that should be selected
	 * @throws {TypeError} if the item is not a gara.widgets.ListItem
	 * @returns {void}
	 */
	selectShift : function (item, add) {
		var indexShift, indexItem, from, to, i;
		this.checkWidget();

		if (!(item instanceof gara.widgets.ListItem)) {
			throw new TypeError("item not instance of gara.widgets.ListItem");
		}

		// remove others selection
		if (!add) {
			while (this.selection.length) {
				this.selection.pop().setSelected(false);
			}
		}

		// only, when selection mode is MULTI
		if ((this.style & gara.MULTI) === gara.MULTI) {
			indexShift = this.indexOf(this.shiftItem);
			indexItem = this.indexOf(item);
			from = indexShift > indexItem ? indexItem : indexShift;
			to = indexShift < indexItem ? indexItem : indexShift;

			for (i = from; i <= to; ++i) {
				this.selection.push(this.items[i]);
				this.items[i].setSelected(true);
			}

			this.notifySelectionListener();
		} else {
			this.select(this.indexOf(item));
		}
	},

	/**
	 * Sets the selection on the receiver.
	 *
	 * @see gara.widgets.List#deselectAll
	 * @param {gara.widgets.ListItem[]|gara.widgets.ListItem} items the array with the <code>ListItem</code> items
	 * @returns {gara.widgets.List} this
	 */
	setSelection : function (items) {
		var item;
		this.checkWidget();

		this.deselectAll();

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
				this.select(this.items.indexOf(items[items.length - 1]));
			}

		} else if (items instanceof gara.widgets.ListItem) {
			this.select(this.indexOf(items));
		}

		return this;
	},

	/**
	 * Sets the topmost item.
	 * 
	 * @see gara.widgets.List#getTopItem
	 * @param {gara.widgets.ListItem} item the new top item
	 * @returns {gara.widgets.List} this
	 */
	setTopItem : function (item) {
		var index, h, i;
		if (!(item instanceof gara.widgets.ListItem)) {
			throw new TypeError("item not instance of gara.widgets.ListItem");
		}

		index = this.indexOf(item);
		h = 0;
		for (i = 0; i < index; i++) {
			h += this.getItemHeight(this.items[index]);
		}

		this.scrolledHandle().scrollTop = h;
		return this;
	},

	/**
	 * Scrolls the receiver that the passed item is visible.
	 * 
	 * @param {gara.widgets.ListItem} item 
	 * @returns {void}
	 */
	showItem : function (item) {
		var index, h, i, newScrollTop;
		if (!(item instanceof gara.widgets.ListItem)) {
			throw new TypeError("item not instance of gara.widgets.ListItem");
		}

		if (this.getVerticalScrollbar()) {
			index = this.indexOf(item);
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
	 * @see gara.widgets.List#showItem
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
	}
};});