/*	$Id: List.class.js 181 2009-08-02 20:51:16Z tgossmann $

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

gara.provide("gara.jswt.widgets.List", "gara.jswt.widgets.Composite");

gara.use("gara.jswt.JSWT");
//gara.use("gara.jswt.widgets.ListItem");

/**
 * @summary
 * gara List Widget
 *
 * @description
 * long description for the List Widget...
 *
 * @class List
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @extends gara.jswt.widgets.Composite
 */
gara.Class("gara.jswt.widgets.List", function () { return {
	$extends : gara.jswt.widgets.Scrollable,

	/**
	 * Contains a reference to the active item.
	 *
	 * @private
	 * @type {gara.jswt.widgets.ListItem}
	 */
	activeItem : null,

	/**
	 * Contains the items.
	 *
	 * @private
	 * @type {gara.jswt.widgets.ListItem[]}
	 */
	items : [],

	/**
	 * Contains the current selection.
	 *
	 * @private
	 * @type {gara.jswt.widgets.ListItem}
	 */
	selection : [],

	/**
	 * A collection of listeners that will be notified, when the selection
	 * of the <code>List</code> changes.
	 *
	 * @private
	 * @type {gara.jswt.events.SelectionListener[]}
	 */
	selectionListeners : [],

	/**
	 * Contains the item that was active when shift was pressed.
	 *
	 * @private
	 * @type {gara.jswt.widgets.ListItem}
	 */
	shiftItem : null,

	/**
	 * @constructor
	 * Constructor
	 *
	 * @param {gara.jswt.widgets.Composite|HTMLElement} parent parent dom node or composite
	 * @param {int} style The style for the list
	 */
	$constructor : function (parent, style) {
		this.items = [];

		this.activeItem = null;
		this.shiftItem = null;

		this.selection = [];
		this.selectionListeners = [];

		this.$super(parent, style || gara.jswt.JSWT.SINGLE);
	},

	/**
	 * @method
	 * Activates an item
	 *
	 * @private
	 * @param {gara.jswt.widgets.ListItem} item the item that should added to the List
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {void}
	 */
	activateItem : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.jswt.widgets.ListItem)) {
			throw new TypeError("item is not type of gara.jswt.widgets.ListItem");
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
	 * @method
	 * Adds an item to the list (invoked by the constructor of ListItem)
	 *
	 * @private
	 * @param {gara.jswt.widgets.ListItem} item the item that should added to the List
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {void}
	 */
	addItem : function (item, index) {
		this.checkWidget();
		if (!(item instanceof gara.jswt.widgets.ListItem)) {
			throw new TypeError("item is not type of gara.jswt.widgets.ListItem");
		}

		if (typeof(index) !== "undefined") {
			this.items.insertAt(index, item);
		} else {
			this.items.push(item);
		}

		return this.handle;
	},

	/**
	 * @method
	 * Adds a selection listener on the list
	 *
	 * @param {gara.jswt.events.SelectionListener} listener the desired listener to be added to this list
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @return {void}
	 */
	addSelectionListener : function (listener) {
		this.checkWidget();
		if (!this.selectionListeners.contains(listener)) {
			this.selectionListeners.push(listener);
		}
	},

	/**
	 * @method
	 * Register listeners for this widget. Implementation for gara.jswt.widgets.Widget
	 *
	 * @private
	 * @return {void}
	 */
	bindListener : function (eventType, listener) {
		gara.EventManager.addListener(this.handle, eventType, listener);
	},

	/**
	 * @private
	 */
	createWidget : function () {
		this.createHandle("ul");

		this.handle.setAttribute("role", "listbox");
		this.handle.setAttribute("aria-multiselectable", (this.style & gara.jswt.JSWT.MULTI) === gara.jswt.JSWT.MULTI ? true : false);
		this.handle.setAttribute("aria-activedescendant", this.getId());

		// add css classes
		this.addClass("jsWTList");
		this.setClass("jsWTListFullSelection", (this.style & gara.jswt.JSWT.FULL_SELECTION) === gara.jswt.JSWT.FULL_SELECTION);
		this.setClass("jsWTListCheckbox", (this.style & gara.jswt.JSWT.CHECK) === gara.jswt.JSWT.CHECK);

		// listeners
		this.addListener("mousedown", this);
		if ((this.style & gara.jswt.JSWT.CHECK) === gara.jswt.JSWT.CHECK) {
			this.addListener("mouseup", this);
		}
	},

	/**
	 * @method
	 * Deselects an item
	 *
	 * @param {int} index item at zero-related index that should be deselected
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {void}
	 */
	deselect : function (index) {
		var item;
		this.checkWidget();

		// return if index are out of bounds
		if (index < 0 || index >= this.items.length) {
			return;
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
	 * @method
	 * Deselects all items in the <code>List</code>
	 *
	 * @return {void}
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

	deselectRange : function (from, to) {
		for (var i = from; i <= to; i++) {
			this.items[i].setSelected(false);
		}
		this.notifySelectionListener();
	},

	dispose : function () {
		this.deselectAll();
		this.$super();

		this.items.forEach(function (item, index, arr) {
			item.dispose();
		}, this);

		if (this.parentNode !== null) {
			this.parentNode.removeChild(this.handle);
		}
		delete this.handle;
	},

	focusGained : function (e) {
		// mark first item active
		if (this.activeItem === null && this.items.length) {
			this.activateItem(this.items[0]);
		}

		this.$super(e);
	},

	/**
	 * @method
	 * Get a specified item with a zero-related index
	 *
	 * @param {int} index the zero-related index
	 * @throws {RangeError} when there is no item at the given index
	 * @return {gara.jswt.widgets.ListItem} the item
	 */
	getItem : function (index) {
		this.checkWidget();
		if (typeof(this.items.indexOf(index)) == "undefined") {
			throw new RangeError("There is no item for the given index");
		}

		return this.items[index];
	},

	/**
	 * @method
	 * Returns the amount of the items in the list
	 *
	 * @return {int} the amount
	 */
	getItemCount : function () {
		return this.items.length;
	},

	/**
	 * @private
	 */
	getItemHeight : function (item) {
		return item.handle.offsetHeight
			+ gara.getNumStyle(item.handle, "margin-top")
			+ gara.getNumStyle(item.handle, "margin-bottom");
	},

	/**
	 * @method
	 * Returns an array with all the items in the list
	 *
	 * @return {gara.jswt.widgets.ListItem[]} the array with the items
	 */
	getItems : function () {
		this.checkWidget();
		return this.items;
	},

	/**
	 * @method
	 * Returns an array with the items which are currently selected in the list
	 *
	 * @return {gara.jswt.widgets.ListItem[]} an array with items
	 */
	getSelection : function () {
		this.checkWidget();
		return this.selection;
	},

	/**
	 * @method
	 * Returns the amount of the selected items in the tree
	 *
	 * @return {int} the amount
	 */
	getSelectionCount : function () {
		this.checkWidget();
		return this.selection.length;
	},

	getTopItem : function () {
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
	 * @method
	 * Handles events on the list. Implements DOMEvent Interface by the W3c.
	 *
	 * @private
	 * @param {Event} e event the users triggers
	 * @return {void}
	 */
	handleEvent : function (e) {
		var widget;
		this.checkWidget();

		// special events for the list
		widget = e.target.widget || null;
		e.item = widget && widget instanceof gara.jswt.widgets.ListItem ? widget : this.activeItem;
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
		switch (e.type) {
		case "mousedown":
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
			break;
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
	 * @method
	 * handling key events on the List
	 *
	 * @private
	 * @param {Event} e event the users triggers
	 * @return {void}
	 */
	handleKeyNavigation : function (e) {
		var prev, next, activeIndex, i, h, viewport, itemAddition, min, lastOffset, scrollRange;
		switch (e.keyCode) {

		// left and up
		case gara.jswt.JSWT.ARROW_LEFT:
		case gara.jswt.JSWT.ARROW_UP:

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
		case gara.jswt.JSWT.ARROW_RIGHT:
		case gara.jswt.JSWT.ARROW_DOWN:

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
		case gara.jswt.JSWT.SPACE:

			if ((this.style & gara.jswt.JSWT.CHECK) === gara.jswt.JSWT.CHECK) {
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
		case gara.jswt.JSWT.HOME:

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
		case gara.jswt.JSWT.END:

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
	 * @method
	 * Looks for the index of a specified item
	 *
	 * @param {gara.jswt.widgets.ListItem} item the item for the index
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {int} the index of the specified item
	 */
	indexOf : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.jswt.widgets.ListItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.ListItem");
		}

		return this.items.indexOf(item);
	},

	/**
	 * @method
	 * Notifies selection listener about the changed selection within the List
	 *
	 * @private
	 * @return {void}
	 */
	notifySelectionListener : function () {
		this.selectionListeners.forEach(function (listener) {
			if (listener.widgetSelected) {
				listener.widgetSelected(this.event);
			}
		}, this);
	},

	/**
	 * @method
	 * Removes an item from the list
	 *
	 * @param {int} index the index of the item
	 * @throw {RangeError} when the specified index is not an item
	 * @return {void}
	 */
	remove : function (index) {
		var item;
		this.checkWidget();
		if (index < 0 || index > this.items.length) {
			throw new RangeError("index out of bounds");
		}
		item = this.items.removeAt(index)[0];
		if (this.selection.contains(item)) {
			this.selection.remove(item);
		}
		item.dispose();
		delete item;
	},

	/**
	 * @method
	 * Removes items within an indices range
	 *
	 * @param {int} start start index
	 * @param {int} end end index
	 * @return {void}
	 */
	removeRange : function (start, end) {
		var i;
		this.checkWidget();
		for (i = start; i <= end; ++i) {
			this.remove(start);
		}
	},

	/**
	 * @method
	 * Removes items which indices are passed by an array
	 *
	 * @param {Array} inidices the array with the indices
	 * @return {void}
	 */
	removeFromArray : function (indices) {
		this.checkWidget();
		indices.forEach(function (item, index, arr) {
			this.remove(index);
		}, this);
	},

	/**
	 * @method
	 * Removes all items from the list
	 *
	 * @return {void}
	 */
	removeAll : function () {
		this.checkWidget();
		while (this.items.length) {
			this.remove(0);
		}
	},

	/**
	 * @method
	 * Removes a selection listener from this list
	 *
	 * @param {gara.jswt.events.SelectionListener} listener the listener to remove from this list
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @return {void}
	 */
	removeSelectionListener : function (listener) {
		this.checkWidget();
		this.selectionListener.remove(listener);
	},

	/**
	 * @method
	 * Selects an item
	 *
	 * @param {gara.jswt.widgets.ListItem} item the item that should be selected
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {void}
	 */
	select : function (index) {
		var item;
		this.checkWidget();

		// return if index are out of bounds
		if (index < 0 || index >= this.items.length) {
			return;
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
		if (!(item instanceof gara.jswt.widgets.ListItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.ListItem");
		}

		if (!add || (this.style & gara.jswt.JSWT.MULTI) !== gara.jswt.JSWT.MULTI) {
			while (this.selection.length) {
				i = this.selection.pop();
				i.setSelected(false);
			}
		}

		this.select(this.indexOf(item));
	},

	/**
	 * @method
	 * Select all items in the list
	 *
	 * @return {void}
	 */
	selectAll : function () {
		this.checkWidget();
		if ((this.style & gara.jswt.JSWT.MULTI) === gara.jswt.JSWT.MULTI) {
			this.items.forEach(function (item) {
				if (!this.selection.contains(item)) {
					item.setSelected(true);
					this.selection.push(item);
				}
			}, this);
			this.notifySelectionListener();
		}
	},

	selectArray : function (indices) {
		if (!indices.length) {
			return;
		}

		if (indices.length > 1 && (this.style & gara.jswt.JSWT.MULTI) === gara.jswt.JSWT.MULTI) {
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

	selectRange : function (from, to) {
		var i;
		if ((to - from) > 1 && (this.style & gara.jswt.JSWT.MULTI) === gara.jswt.JSWT.MULTI) {
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
	 * @method
	 * Selects a range. From the item with shift-lock to the passed item.
	 *
	 * @private
	 * @param {gara.jswt.widgets.ListItem} item the item that should be selected
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {void}
	 */
	selectShift : function (item, add) {
		var indexShift, indexItem, from, to, i;
		this.checkWidget();

		if (!(item instanceof gara.jswt.widgets.ListItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.ListItem");
		}

		// remove others selection
		if (!add) {
			while (this.selection.length) {
				this.selection.pop().setSelected(false);
			}
		}

		// only, when selection mode is MULTI
		if ((this.style & gara.jswt.JSWT.MULTI) === gara.jswt.JSWT.MULTI) {
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
	 * @method
	 * Sets the selection of the <code>List</code>
	 *
	 * @param {gara.jswt.widgets.ListItem[]|gara.jswt.widgets.ListItem} items the array with the <code>ListItem</code> items
	 * @return {void}
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
			if (items.length > 1 && (this.style & gara.jswt.JSWT.MULTI) === gara.jswt.JSWT.MULTI) {
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

		} else if (gara.instanceOf(items, gara.jswt.widgets.ListItem)) {
			this.select(this.indexOf(items));
		}

		return this;
	},

	setTopItem : function (item) {
		var index, h, i;
		if (!(item instanceof gara.jswt.widgets.ListItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.ListItem");
		}

		index = this.indexOf(item);
		h = 0;
		for (i = 0; i < index; i++) {
			h += this.getItemHeight(this.items[index]);
		}

		this.scrolledHandle().scrollTop = h;
		return this;
	},

	showItem : function (item) {
		var index, h, i, newScrollTop;
		if (!(item instanceof gara.jswt.widgets.ListItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.ListItem");
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

	showSelection : function () {
		if (this.selection.length) {
			this.showItem(this.selection[0]);
		}
	},

	unbindListener : function (eventType, listener) {
		gara.EventManager.removeListener(this.handle, eventType, listener);
	},

	/**
	 * @method
	 * Works on the <code>List</code>'s outstanding paint requests.
	 *
	 * @return {void}
	 */
	update : function () {
		this.checkWidget();
	}
};});