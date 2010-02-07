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

gara.provide("gara.jswt.widgets.List");

gara.require("gara.Utils");
gara.require("gara.OutOfBoundsException");
gara.require("gara.jswt.JSWT");
gara.require("gara.jswt.widgets.Scrollable");

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
 * @extends gara.jswt.widgets.Scrollable
 */
gara.Class("gara.jswt.widgets.List", {
	$extends : gara.jswt.widgets.Scrollable,

	/**
	 * @constructor
	 * Constructor
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.widgets.Composite|HTMLElement} parent parent dom node or composite
	 * @param {int} style The style for the list
	 * @return {gara.jswt.widgets.List} list widget
	 */
	$constructor : function(parent, style) {
		this._items = [];
		this._activeItem = null;
		this._shiftItem = null;

		this._selection = [];
		this._selectionListener = [];

		this.$base(parent, style || gara.jswt.JSWT.SINGLE);
	},

	/**
	 * @method
	 * Activates an item
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.widgets.ListItem} item the item that should added to the List
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {void}
	 */
	_activateItem : function(item) {
		this.checkWidget();
		if (!gara.instanceOf(item, gara.jswt.widgets.ListItem)) {
			throw new TypeError("item is not type of gara.jswt.widgets.ListItem");
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
	 * Adds an item to the list (invoked by the constructor of ListItem)
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.widgets.ListItem} item the item that should added to the List
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {void}
	 */
	_addItem : function(item, index) {
		this.checkWidget();
		if (!gara.instanceOf(item, gara.jswt.widgets.ListItem)) {
			throw new TypeError("item is not type of gara.jswt.widgets.ListItem");
		}

		if (typeof(index) != "undefined") {
			this._items.insertAt(index, item);
		} else {
			this._items.push(item);
		}

		return this._createItem(item, index);
	},

	/**
	 * @method
	 * Adds a selection listener on the list
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.SelectionListener} listener the desired listener to be added to this list
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @return {void}
	 */
	addSelectionListener : function(listener) {
		this.checkWidget();
		if (!gara.instanceOf(listener, gara.jswt.events.SelectionListener)) {
			throw new TypeError("listener is not instance of gara.jswt.events.SelectionListener");
		}

		this._selectionListener.push(listener);
	},

	_createItem : function(item, index) {
		var itemHandle = document.createElement("li");
		itemHandle.control = this;
		base2.DOM.Event(itemHandle);

		// add node to dom
		if (typeof(index) == "undefined") {
			this.handle.appendChild(itemHandle);
		} else {
			var nextNode = index == 0
				? this.handle.firstChild
				: this._items[index - 1].handle.nextSibling;
			this.handle.insertBefore(itemHandle, nextNode);
		}

		return itemHandle;
	},

	_createWidget : function() {
		this.$base("ul");

		this.handle.setAttribute("role", "listbox");
		this.handle.setAttribute("aria-multiselectable", (this._style & gara.jswt.JSWT.MULTI) == gara.jswt.JSWT.MULTI ? true : false);
		this.handle.setAttribute("aria-activedescendant", this.getId());

		// add css classes
		this.addClass("jsWTList");
		this.setClass("jsWTListFullSelection", (this._style & gara.jswt.JSWT.FULL_SELECTION) == gara.jswt.JSWT.FULL_SELECTION);
		this.setClass("jsWTListCheckbox", (this._style & gara.jswt.JSWT.CHECK) == gara.jswt.JSWT.CHECK);

		// listeners
		this.addListener("mousedown", this);
		if ((this._style & gara.jswt.JSWT.CHECK) == gara.jswt.JSWT.CHECK) {
			this.addListener("mouseup", this);
		}
	},

	/**
	 * @method
	 * Deselects an item
	 *
	 * @author Thomas Gossmann
	 * @param {int} index item at zero-related index that should be deselected
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {void}
	 */
	deselect : function(index) {
		this.checkWidget();

		// return if index are out of bounds
		if (index < 0 || index >= this._items.length) {
			return;
		}

		var item = this._items[index];
		if (this._selection.contains(item)) {
			item._setSelected(false);
			this._selection.remove(item);
			this._shiftItem = item;
			this._notifySelectionListener();
		}
	},

	/**
	 * @method
	 * Deselects all items in the <code>List</code>
	 *
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	deselectAll : function() {
		this.checkWidget();
		if (this._selection.length) {
			while (this._selection.length) {
				var item = this._selection.pop();
				item._setSelected(false);
			}
			this._notifySelectionListener();
		}
	},

	deselectArray : function(indices) {
		if (this._selection.length) {
			indices.forEach(function(index) {
				if (index < 0 || index >= this._items.length) {
					return;
				}
				this._items[index]._setSelected(false);
			}, this);
			this._notifySelectionListener();
		}
	},

	deselectRange : function(from, to) {
		for (var i = from; i <= to; i++) {
			this._items[i]._setSelected(false);
		}
		this._notifySelectionListener();
	},

	dispose : function() {
		this.deselectAll();
		this.$base();

		this._items.forEach(function(item, index, arr) {
			item.dispose();
		}, this);

		if (this._parentNode != null) {
			this._parentNode.removeChild(this.handle);
		}
		delete this.handle;
	},

	focusGained : function(e) {
		// mark first item active
		if (this._activeItem == null && this._items.length) {
			this._activateItem(this._items[0]);
		}

		this.$base(e);
	},

	/**
	 * @method
	 * Get a specified item with a zero-related index
	 *
	 * @author Thomas Gossmann
	 * @param {int} index the zero-related index
	 * @throws {gara.OutOfBoundsException} if the index does not live within this list
	 * @return {gara.jswt.widgets.ListItem} the item
	 */
	getItem : function(index) {
		this.checkWidget();
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

	_getItemHeight : function(item) {
		return item.handle.offsetHeight
			+ parseInt(gara.Utils.getStyle(item.handle, "margin-top"))
			+ parseInt(gara.Utils.getStyle(item.handle, "margin-bottom"));
	},

	/**
	 * @method
	 * Returns an array with all the items in the list
	 *
	 * @author Thomas Gossmann
	 * @return {gara.jswt.widgets.ListItem[]} the array with the items
	 */
	getItems : function() {
		return this._items;
	},

	/**
	 * @method
	 * Returns an array with the items which are currently selected in the list
	 *
	 * @author Thomas Gossmann
	 * @return {gara.jswt.widgets.ListItem[]} an array with items
	 */
	getSelection : function() {
		this.checkWidget();
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
		this.checkWidget();
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
	 * Handles events on the list. Implements DOMEvent Interface by the W3c.
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @param {Event} e event the users triggers
	 * @return {void}
	 */
	handleEvent : function(e) {
		this.checkWidget();

		// special events for the list
		var widget = e.target.widget || null;
		e.item = widget && gara.instanceOf(widget, gara.jswt.widgets.ListItem) ? widget : this._activeItem;
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
					this._activateItem(item);
					if (!e.ctrlKey && !e.shiftKey) {
						this._selectAdd(item, false);
					} else if (e.ctrlKey && e.shiftKey) {
						this._selectShift(item, true);
					} else if (e.shiftKey) {
						this._selectShift(item, false);
					} else if (e.ctrlKey) {
						if (this._selection.contains(item)) {
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
	 * handling key events on the List
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @param {Event} e event the users triggers
	 * @return {void}
	 */
	_handleKeyNavigation : function(e) {
		switch (e.keyCode) {

			// left and up
			case gara.jswt.JSWT.ARROW_LEFT:
			case gara.jswt.JSWT.ARROW_UP:

				// determine previous item
				var prev = false;
				var activeIndex = this.indexOf(this._activeItem);

				if (activeIndex != 0) {
					prev = this._items[activeIndex - 1];
				}

				if (prev) {
					// update scrolling
					var h = 0;
					for (var i = 0; i < (activeIndex - 1); i++) {
						h += this._getItemHeight(this._items[i]);
					}
					var viewport = this.handle.clientHeight + this.handle.scrollTop
						- parseInt(gara.Utils.getStyle(this.handle, "padding-top"))
						- parseInt(gara.Utils.getStyle(this.handle, "padding-bottom"));
					var itemAddition = prev.handle.clientHeight
						- parseInt(gara.Utils.getStyle(prev.handle, "padding-top"))
						- parseInt(gara.Utils.getStyle(prev.handle, "padding-bottom"));

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

			// right and down
			case gara.jswt.JSWT.ARROW_RIGHT:
			case gara.jswt.JSWT.ARROW_DOWN:

				// determine next item
				var next = false;
				var activeIndex = this.indexOf(this._activeItem);

				// item is last;
				if (activeIndex != this._items.length - 1) {
					next = this._items[activeIndex + 1];
				}

				if (next) {
					// update scrolling
					var h = 0;
					for (var i = 0; i <= (activeIndex + 1); i++) {
						h += this._getItemHeight(this._items[i]);
					}
					var min = h - this._getItemHeight(next);
					var viewport = this.handle.clientHeight + this.handle.scrollTop
						- parseInt(gara.Utils.getStyle(this.handle, "padding-top"))
						- parseInt(gara.Utils.getStyle(this.handle, "padding-bottom"));
					var scrollRange = h - this.handle.clientHeight
						+ parseInt(gara.Utils.getStyle(this.handle, "padding-top"))
						+ parseInt(gara.Utils.getStyle(this.handle, "padding-bottom"));

					this.handle.scrollTop = h > viewport ? (scrollRange < 0 ? 0 : scrollRange) : (this.handle.scrollTop > min ? min : this.handle.scrollTop);

					// handle select and active item
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

			// space
			case gara.jswt.JSWT.SPACE:

				if ((this._style & gara.jswt.JSWT.CHECK) == gara.jswt.JSWT.CHECK) {
					this._activeItem.setChecked(!this._activeItem.getChecked());
				}

				// handle select and active item
				if (this._selection.contains(this._activeItem) && e.ctrlKey) {
					this.deselect(this.indexOf(this._activeItem));
				} else {
					this._selectAdd(this._activeItem, true);
				}
				break;

			// home
			case gara.jswt.JSWT.HOME:

				// update scrolling
				this.handle.scrollTop = 0;

				// handle select and active item
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

				// update scrolling
				this.handle.scrollTop = this.handle.scrollHeight - this.handle.clientHeight;

				// handle select and active item
				var lastOffset = this._items.length - 1;
				if (!e.ctrlKey && !e.shiftKey) {
					this._activateItem(this._items[lastOffset]);
					this._selectAdd(this._items[lastOffset], false);
				} else if (e.shiftKey) {
					this._activateItem(this._items[lastOffset]);
					this._selectShift(this._items[lastOffset], false);
				} else if (e.ctrlKey) {
					this._activateItem(this._items[lastOffset]);
				}
				break;

			// a
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
	 * @author Thomas Gossmann
	 * @param {gara.jswt.widgets.ListItem} item the item for the index
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {int} the index of the specified item
	 */
	indexOf : function(item) {
		this.checkWidget();
		if (!gara.instanceOf(item, gara.jswt.widgets.ListItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.ListItem");
		}

		return this._items.indexOf(item);
	},

	/**
	 * @method
	 * Notifies selection listener about the changed selection within the List
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_notifySelectionListener : function() {
		this._selectionListener.forEach(function(listener) {
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

	/**
	 * @method
	 * Removes an item from the list
	 *
	 * @author Thomas Gossmann
	 * @param {int} index the index of the item
	 * @return {void}
	 */
	remove : function(index) {
		this.checkWidget();
		if (index < 0 || index > this._items.length) {
			throw new gara.OutOfBoundsException("index out of bounds");
		}
		var item = this._items.removeAt(index)[0];
		if (this._selection.contains(item)) {
			this._selection.remove(item);
		}
		item.dispose();
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
		this.checkWidget();
		for (var i = start; i <= end; ++i) {
			this.remove(start);
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
		this.checkWidget();
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
		this.checkWidget();
		while (this._items.length) {
			/*var item = this._items.pop();
			this.handle.removeChild(item.handle);
			delete item;*/
			this.remove(0);
		}
	},

	/**
	 * @method
	 * Removes a selection listener from this list
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.SelectionListener} listener the listener to remove from this list
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @return {void}
	 */
	removeSelectionListener : function(listener) {
		this.checkWidget();
		if (!gara.instanceOf(listener, gara.jswt.events.SelectionListener)) {
			throw new TypeError("listener is not instance of gara.jswt.events.SelectionListener");
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
	 * @param {gara.jswt.widgets.ListItem} item the item that should be selected
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {void}
	 */
	select : function(index) {
		this.checkWidget();

		// return if index are out of bounds
		if (index < 0 || index >= this._items.length) {
			return;
		}

		var item = this._items[index];
		if (!this._selection.contains(item)) {
			item._setSelected(true);
			this._selection.push(item);
			this._shiftItem = item;
			this._notifySelectionListener();
		}
	},

	_selectAdd : function(item, _add) {
		this.checkWidget();
		if (!gara.instanceOf(item, gara.jswt.widgets.ListItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.ListItem");
		}

		if (!_add || (this._style & gara.jswt.JSWT.MULTI) != gara.jswt.JSWT.MULTI) {
			while (this._selection.length) {
				var i = this._selection.pop();
				i._setSelected(false);
			}
		}

		this.select(this.indexOf(item));
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
		if ((this._style & gara.jswt.JSWT.MULTI) == gara.jswt.JSWT.MULTI) {
			this._items.forEach(function(item) {
				if (!this._selection.contains(item)) {
					item._setSelected(true);
					this._selection.push(item);
				}
			}, this);
			this._notifySelectionListener();
		}
	},

	selectArray : function(indices) {
		if (!indices.length) {
			return;
		}

		if (indices.length > 1 && (this._style & gara.jswt.JSWT.MULTI) == gara.jswt.JSWT.MULTI) {
			indices.forEach(function(index) {
				if (!this._selection.contains(this._items[index])) {
					this._items[index]._setSelected(true);
					this._selection.push(this._items[index]);
				}
			}, this);
			this._notifySelectionListener();
		} else {
			this.select(indices[indices.length - 1]);
		}
	},

	selectRange : function(from, to) {
		if ((to - from) > 1 && (this._style & gara.jswt.JSWT.MULTI) == gara.jswt.JSWT.MULTI) {
			for (var i = from; i <= to; i++) {
				if (!this._selection.contains(this._items[i])) {
					this._items[i].setSelected(true);
					this._selection.push(this._items[i]);
				}
			}
			this._notifySelectionListener();
		} else {
			this.select(to);
		}
	},

	/**
	 * @method
	 * Selects a range. From the item with shift-lock to the passed item.
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.widgets.ListItem} item the item that should be selected
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {void}
	 */
	_selectShift : function(item, _add) {
		this.checkWidget();
		if (!gara.instanceOf(item, gara.jswt.widgets.ListItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.ListItem");
		}

		// remove others selection
		if (!_add) {
			while (this._selection.length) {
				var i = this._selection.pop();
				i._setSelected(false);
			}
		}

		// only, when selection mode is MULTI
		if ((this._style & gara.jswt.JSWT.MULTI) == gara.jswt.JSWT.MULTI) {
			var indexShift = this.indexOf(this._shiftItem);
			var indexItem = this.indexOf(item);
			var from = indexShift > indexItem ? indexItem : indexShift;
			var to = indexShift < indexItem ? indexItem : indexShift;

			for (var i = from; i <= to; ++i) {
				this._selection.push(this._items[i]);
				this._items[i]._setSelected(true);
			}

			this._notifySelectionListener();
		} else {
			this.select(this.indexOf(item));
		}
	},

	/**
	 * @method
	 * Sets the selection of the <code>List</code>
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.widgets.ListItem[]|gara.jswt.widgets.ListItem} items the array with the <code>ListItem</code> items
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
				this.select(this._items.indexOf(items[items.length - 1]));
			}

		} else if (gara.instanceOf(items, gara.jswt.widgets.ListItem)) {
			this.select(this.indexOf(items));
		}

		return this;
	},

	setTopItem : function(item) {
		if (!gara.instanceOf(item, gara.jswt.widgets.ListItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.ListItem");
		}

		var index = this.indexOf(item);
		var h = 0;
		for (var i = 0; i < index; i++) {
			h += this._getItemHeight(this._items[index]);
		}

		this._scrolledHandle().scrollTop = h;
		return this;
	},

	showItem : function(item) {
		if (!gara.instanceOf(item, gara.jswt.widgets.ListItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.ListItem");
		}

		if (this.getVerticalScrollbar()) {
			var index = this.indexOf(item);
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
	 * Updates the list!
	 *
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	update : function() {
		this.checkWidget();

		// update items
		this._items.forEach(function(item) {
			item._setParentNode(this.handle);
			item.update();
		}, this);
	}
});