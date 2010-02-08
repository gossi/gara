/*	$Id $

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

gara.provide("gara.jswt.widgets.Table");

gara.use("gara.Utils");
gara.use("gara.EventManager");
gara.use("gara.OutOfBoundsException");
gara.use("gara.jswt.events.SelectionListener");
gara.use("gara.jswt.widgets.TableColumn");
gara.use("gara.jswt.widgets.TableItem");

gara.require("gara.jswt.JSWT");
gara.require("gara.jswt.widgets.Composite");

/**
 * gara Table Widget
 *
 * @class Table
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @extends gara.jswt.widgets.Composite
 */
gara.Class("gara.jswt.widgets.Table", {
	$extends : gara.jswt.widgets.Composite,

	/**
	 * @constructor
	 *
	 * @param {gara.jswt.widgets.Composite|HTMLElement} parent parent dom node or composite
	 * @param {int} style The style for the list
	 */
	$constructor : function(parent, style) {
		// items
		this._items = [];
		this._columns = [];
		this._columnOrder = [];
		this._virtualColumn = null;

		// flags
		this._headerVisible = false;
		this._linesVisible = false;

		// nodes
		this._table = null;
		this._thead = null;
		this._theadRow = null;
		this._tbody = null;
		this._checkboxCol = null;

		this._event = null;
		this._selection = [];
		this._selectionListener = [];
		this._shiftItem = null;
		this._activeItem = null;

		this.$base(parent, style || gara.jswt.JSWT.SINGLE);
	},

	_activateItem : function(item) {
		this.checkWidget();
		if (!gara.instanceOf(item, gara.jswt.widgets.TableItem)) {
			throw new TypeError("item is not type of gara.jswt.widgets.TableItem");
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

	_addItem : function(item, index) {
		this.checkWidget();
		if (!gara.instanceOf(item, gara.jswt.widgets.TableItem)) {
			throw new TypeError("item is not a gara.jswt.widgets.TableItem");
		}

		if (typeof(index) != "undefined") {
			this._items.insertAt(index, item);
		} else {
			this._items.push(item);
		}
		item._setParentNode(this._tbody);
	},

	_addColumn : function(column, index) {
		this.checkWidget();
		if (!gara.instanceOf(column, gara.jswt.widgets.TableColumn)) {
			throw new TypeError("column is not a gara.jswt.widgets.TableColumn");
		}

		if (index) {
			this._columns[index] = column;
			if (!this._columnOrder.contains(index)) {
				this._columnOrder.push(index);
			}
		} else {
			this._columns.push(column);
			this._columnOrder.push(this._columns.length - 1);
		}
		column._setParentNode(this._theadRow);
	},

	/**
	 * @method
	 * Adds a selection listener on the table
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.SelectionListener} listener the desired listener to be added to this table
	 * @throws {TypeError} if the listener is not a SelectionListener
	 * @return {void}
	 */
	addSelectionListener : function(listener) {
		if (!gara.instanceOf(listener, gara.jswt.events.SelectionListener)) {
			throw new TypeError("listener is not type of gara.jswt.events.SelectionListener");
		}

		if (!this._selectionListener.contains(listener)) {
			this._selectionListener.push(listener);
		}
	},

	/**
	 * @method
	 * Clears an item at a given index
	 *
	 * @author Thomas Gossmann
	 * @param {int} index the position of the item
	 * @return {void}
	 */
	clear : function(index) {
		this.checkWidget();
		if (index < 0 || index >= this._items.length) {
			return;
		}
		var item = this._items[index];
		item.clear();
	},

	_createWidget : function() {
		this.$base("div");
		this.handle.setAttribute("role", "grid");
		this.handle.setAttribute("aria-multiselectable", (this._style & gara.jswt.JSWT.MULTI) == gara.jswt.JSWT.MULTI ? true : false);
		this.handle.setAttribute("aria-activedescendant", this.getId());
		this.handle.setAttribute("aria-readonly", true);

		// css
		this.addClass("jsWTTable");
		this.setClass("jsWTTableLines", this._linesVisible);
		this.setClass("jsWTTableNoLines", !this._linesVisible);

		// nodes
		this._scroller = document.createElement("div");
		this._scroller.id = this.getId() + "-scroller";
		this._scroller.className = "scroller";
		this._scroller.widget = this;
		this._scroller.control = this;
		base2.DOM.Event(this._scroller);
		this._scroller.setAttribute("role", "presentation");
		this.handle.appendChild(this._scroller);

		this._table = document.createElement("table");
		this._table.id = this.getId() + "-table";
		this._table.widget = this;
		this._table.control = this;
		base2.DOM.Event(this._table);
		this._table.setAttribute("role", "presentation");
		this._scroller.appendChild(this._table);

		// table head
		this._thead = document.createElement("thead");
		this._thead.id = this.getId() + "-thead";
		this._thead.widget = this;
		this._thead.control = this;
		base2.DOM.Event(this._thead);
		this._thead.setAttribute("role", "presentation");
		this._table.appendChild(this._thead);

		this._theadRow = document.createElement("tr");
		this._theadRow.id = this.getId() + "-theadRow";
		this._theadRow.widget = this;
		this._theadRow.control = this;
		base2.DOM.Event(this._headRow);
		this._theadRow.setAttribute("role", "row");
		this._thead.appendChild(this._theadRow);

		// if check style
		if ((this._style & gara.jswt.JSWT.CHECK) == gara.jswt.JSWT.CHECK) {
			this._checkboxCol = document.createElement("th");
			this._checkboxCol.className = "jsWTTableCheckboxCol";
			base2.DOM.Event(this._checkboxCol);
			this._checkboxCol.setAttribute("role", "columnheader");
			this._theadRow.appendChild(this._checkboxCol);
			this.addClass("jsWTTableCheckbox");
		}

		// table body
		this._tbody = document.createElement("tbody");
		this._tbody.id = this.getId() + "-tbody";
		this._tbody.widget = this;
		this._tbody.control = this;
		base2.DOM.Event(this._tbody);
		this._tbody.setAttribute("role", "presentation");
		this._table.appendChild(this._tbody);

		if ((this._style & gara.jswt.JSWT.FULL_SELECTION) == gara.jswt.JSWT.FULL_SELECTION) {
			this._tbody.className = "jsWTTableFullSelection";
		}

		// create column header (to calculate width later)
//		for (var i = 0, len = this._columnOrder.length; i < len; ++i) {
//			this._columns[this._columnOrder[i]]._setParentNode(this._theadRow);
//			this._columns[this._columnOrder[i]].update();
//		}

		// listener
		this.addListener("mousedown", this);
		if ((this._style & gara.jswt.JSWT.CHECK) == gara.jswt.JSWT.CHECK) {
			this.addListener("mouseup", this);
		}

		// intial width calculation for TableColumns
		this._theadRow.style.width = this.handle.offsetWidth + "px";
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

		this._columns.forEach(function(col, index, arr) {
			col.dispose();
		}, this);

		this._items.forEach(function(item, index, arr) {
			item.dispose();
		}, this);

		this._thead.removeChild(this._theadRow);
		this._table.removeChild(this._thead);
		this._table.removeChild(this._tbody);
		this._scroller.removeChild(this._table);
		this.handle.removeChild(this._scroller);

		if (this._parentNode != null) {
			this._parentNode.removeChild(this.handle);
		}

		delete this._theadRow;
		delete this._thead;
		delete this._tbody;
		delete this._table;
		delete this.handle;
	},

	focusGained : function(e) {
		// mark first item active
		if (this._activeItem == null && this._items.length) {
			this._activateItem(this._items[0]);
		}

		this.$base(e);
	},

	getColumn : function(index) {
		this.checkWidget();
		if (index >= 0 && index < this._columns.length) {
			return this._columns[index];
		}
		return null;
	},

	getColumnCount : function() {
		return this._columns.length;
	},

	getColumnOrder : function() {
		return this._columnOrder;
	},

	getColumns : function() {
		return this._columns;
	},

	getHeaderVisible : function() {
		return this._headerVisible;
	},

	/**
	 * @method
	 * Gets a specified item with a zero-related index
	 *
	 * @author Thomas Gossmann
	 * @param {int} index the zero-related index
	 * @throws {gara.OutOfBoundsException} if the requested index is out of bounds
	 * @return {gara.jswt.widgets.TreeItem} the item
	 */
	getItem : function(index) {
		this.checkWidget();
		if (index >= this._items.length) {
			throw new gara.OutOfBoundsException("The requested index exceeds the bounds");
		}

		return this._items[index];
	},

	getItemCount : function() {
		return this._items.length;
	},

	_getItemHeight : function(item) {
		return item.handle.offsetHeight
			+ parseInt(gara.Utils.getStyle(item.handle, "margin-top"))
			+ parseInt(gara.Utils.getStyle(item.handle, "margin-bottom"));
	},

	getItems : function() {
		return this._items;
	},

	getLinesVisible : function() {
		return this._linesVisible;
	},

	/**
	 * @method
	 * Returns an array with the items which are currently selected in the table
	 *
	 * @author Thomas Gossmann
	 * @return {gara.jswt.widgets.TreeItem[]}an array with items
	 */
	getSelection : function() {
		return this._selection;
	},

	/**
	 * @method
	 * Returns the amount of the selected items in the table
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

	handleEvent : function(e) {
		this.checkWidget();

		// special events for the list
		var widget = e.target.widget || null;
		e.item = widget && (gara.instanceOf(widget, gara.jswt.widgets.TableItem) || gara.instanceOf(widget, gara.jswt.widgets.TableColumn)) ? widget : this._activeItem;
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

		if (e.type != "mouseup") {
			e.stopPropagation();
		}
		/* in case of ie6, it is necessary to return false while the type of
		 * the event is "contextmenu" and the menu isn't hidden in ie6
		 */
		return false;
	},

	_handleMouseEvents : function(e) {
		var item = e.item;
		switch (e.type) {
			case "mousedown":
				if (gara.instanceOf(item, gara.jswt.widgets.TableItem)) {
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

	_handleKeyNavigation : function(e) {
		switch (e.keyCode) {

			// up
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
					var viewport = this._scroller.clientHeight + this._scroller.scrollTop
						- parseInt(gara.Utils.getStyle(this._scroller, "padding-top"))
						- parseInt(gara.Utils.getStyle(this._scroller, "padding-bottom"));
					var itemAddition = prev.handle.clientHeight
						- parseInt(gara.Utils.getStyle(prev.handle, "padding-top"))
						- parseInt(gara.Utils.getStyle(prev.handle, "padding-bottom"));

					this._scroller.scrollTop = h < this._scroller.scrollTop ? h : (viewport < h ? h - viewport + itemAddition : this._scroller.scrollTop);


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
				var next = false;
				var activeIndex = this.indexOf(this._activeItem);

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
					var viewport = this._scroller.clientHeight + this._scroller.scrollTop
						- parseInt(gara.Utils.getStyle(this._scroller, "padding-top"))
						- parseInt(gara.Utils.getStyle(this._scroller, "padding-bottom"));
					var scrollRange = h - this._scroller.clientHeight
						+ parseInt(gara.Utils.getStyle(this._scroller, "padding-top"))
						+ parseInt(gara.Utils.getStyle(this._scroller, "padding-bottom"));

					this._scroller.scrollTop = h > viewport ? (scrollRange < 0 ? 0 : scrollRange) : (this._scroller.scrollTop > min ? min : this._scroller.scrollTop);


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
				this._scroller.scrollTop = 0;

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
				this._scroller.scrollTop = this._scroller.scrollHeight - this._scroller.clientHeight;

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
		}
	},

	/**
	 * @method
	 * Looks for the index of a specified item
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.widgets.TableItem} item the item for the index
	 * @throws {TypeError} if the item is not a TableItem
	 * @return {int} the index of the specified item
	 */
	indexOf : function(item) {
		this.checkWidget();
		if (!gara.instanceOf(item, gara.jswt.widgets.TableItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.TableItem");
		}

		return this._items.indexOf(item);
	},

	getVerticalScrollbar : function() {
		return this._tbody.clientHeight > this._scroller.clientHeight;
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
		this._selectionListener.forEach(function(item, index, arr) {
			item.widgetSelected(this._event);
		}, this);
	},

	_registerListener : function(eventType, listener) {
		gara.EventManager.addListener(this.handle, eventType, listener);
	},

	/**
	 * @method
	 * Removes an item from the table
	 *
	 * @author Thomas Gossmann
	 * @param {int} index the index of the item
	 * @return {void}
	 */
	remove : function(index) {
		this.checkWidget();
		var item = this._items.removeAt(index)[0];
		item.dispose();
		delete item;
	},

	/**
	 * @method
	 * Removes items whose indices are passed by an array
	 *
	 * @author Thomas Gossmann
	 * @param {Array} inidices the array with the indices
	 * @return {void}
	 */
	removeArray : function(indices) {
		this.checkWidget();
		indices.forEach(function(index) {
			this.remove(index);
		}, this);
	},

	/**
	 * @method
	 * Removes all items from the table
	 *
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	removeAll : function() {
		this.checkWidget();
		while (this._items.length) {
			var item = this._items.pop();
			item.dispose();
			delete item;
		}
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
	 * Removes a selection listener from this table
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.SelectionListener} listener the listener to be removed from this table
	 * @throws {TypeError} if the listener is not a SelectionListener
	 * @return {void}
	 */
	removeSelectionListener : function(listener) {
		if (!gara.instanceOf(listener, gara.jswt.events.SelectionListener)) {
			throw new TypeError("listener is not type of gara.jswt.events.SelectionListener");
		}

		if (this._selectionListener.contains(listener)) {
			this._selectionListener.remove(listener);
		}
	},

	_scrolledHandle : function() {
		return this._scroller;
	},

	/**
	 * @method
	 * Selects an item
	 *
	 * @author Thomas Gossmann
	 * @param {int} index the index of the Item that should be selected
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

	/**
	 * @method
	 * Selects an item
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.widgets.TableItem} item the item that should be selected
	 * @throws {TypeError} if the item is not a TableItem
	 * @return {void}
	 */
	_selectAdd : function(item, _add) {
		this.checkWidget();
		if (!gara.instanceOf(item, gara.jswt.widgets.TableItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.TableItem");
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
	 * Selects a Range of items. From shiftItem to the passed item.
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.widgets.TableItem} item the item
	 * @return {void}
	 */
	_selectShift : function(item, _add) {
		this.checkWidget();
		if (!gara.instanceOf(item, gara.jswt.widgets.TableItem)) {
			throw new TypeError("item is not type of gara.jswt.widgets.TableItem");
		}

		if (!_add) {
			while (this._selection.length) {
				var i = this._selection.pop();
				i._setSelected(false);
			}
		}

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
	 * Sets the selection of the <code>Table</code>
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.widgets.TableItem[]|gara.jswt.widgets.TableItem} items an array or single <code>TableItem</code>
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

	setColumnOrder : function(order) {
		this._columnOrder = order;
		return this;
	},

	setHeaderVisible : function(show) {
		this._headerVisible = show;
		if (this._thead != null) {
			this._thead.style.display = this._headerVisible ? (document.all ? "block" : "table-row-group") : "none";
		}
		return this;
	},

	setHeight : function(height) {
		this._height = height;
		this.handle.style.height = this._height != null ? (this._height - (this._headerVisible ? this._thead.offsetHeight : 0) - heightSub) + "px" : "";
		return this;
	},

	setLinesVisible : function(show) {
		this._linesVisible = show;
		this.setClass("jsWTTableLines", this._linesVisible);
		this.setClass("jsWTTableNoLines", !this._linesVisible);
		return this;
	},

	setTopItem : function(item) {
		if (!gara.instanceOf(item, gara.jswt.widgets.TableItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.TableItem");
		}

		var index = this.indexOf(item);
		var h = 0;
		for (var i = 0; i < index; i++) {
			h += this._getItemHeight(this._items[index]);
		}

		this._scrolledHandle().scrollTop = h;
		return this;
	},

	setWidth : function(width) {
		this._width = width;
		if (this._width != null) {
			this.handle.style.width = this._width + "px";
			this._thead.style.width = this._width + "px";
		}
		this.handle.style.width = this._width != null ? (this._width - parseInt(gara.Utils.getStyle(this.handle, "padding-left")) - parseInt(gara.Utils.getStyle(this.handle, "padding-right")) - parseInt(gara.Utils.getStyle(this.handle, "border-left-width")) - parseInt(gara.Utils.getStyle(this.handle, "border-right-width"))) + "px" : "auto";
		return this;
	},

	showItem : function(item) {
		if (!gara.instanceOf(item, gara.jswt.widgets.TableItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.TableItem");
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

	update : function() {
		this.checkWidget();

		// update table head
		this._thead.style.position = "static";

		if (this._virtualColumn && this._columns.length) {
			this._virtualColumn.dispose();
			this._virtualColumn = null;
		}
		while (this._theadRow.childNodes.length && this._columns.length) {
			this._theadRow.removeChild(this._theadRow.childNodes[0]);
		}

		if ((this._style & gara.jswt.JSWT.CHECK) == gara.jswt.JSWT.CHECK) {
			this._theadRow.appendChild(this._checkboxCol);
		}

		// add virtual column if no columns present
		if (!this._columns.length) {
			this._virtualColumn = new gara.jswt.widgets.TableColumn(this);
			this._virtualColumn._setParentNode(this._theadRow);
			this._virtualColumn.update();
			this._columns = [];
			this._columnOrder = [];
		}

		// adding cols
		for (var i = 0, len = this._columnOrder.length; i < len; ++i) {
			var col = this._columns[this._columnOrder[i]];

			if (col.isDisposed()) {
				this._columns.remove(col);
			} else {
				col._setParentNode(this._theadRow);
				col.update();
				this._theadRow.appendChild(col.handle);
			}
		}

		// setting col width
		for (var i = 0, len = this._columnOrder.length; i < len; ++i) {
			var col = this._columns[this._columnOrder[i]];
			col.setWidth(col.getWidth() + (i == (len - 1) && this.getVerticalScrollbar() ? 19 : 0));
		}

		// update items
		this._items.forEach(function(item, index, arr) {
			item._setParentNode(this._tbody);
			item.update();
		}, this);


		// reset measurement for new calculations
		this._thead.style.position = "absolute";

		if (this._width != null) {
			this.handle.style.width = this._width + "px";
			this._thead.style.width = this._width + "px";
		}

		var heightSub = parseInt(gara.Utils.getStyle(this.handle, "padding-top")) + parseInt(gara.Utils.getStyle(this.handle, "padding-bottom")) + parseInt(gara.Utils.getStyle(this.handle, "border-top-width")) + parseInt(gara.Utils.getStyle(this.handle, "border-bottom-width"));
		this.handle.style.width = this._width != null ? (this._width - parseInt(gara.Utils.getStyle(this.handle, "padding-left")) - parseInt(gara.Utils.getStyle(this.handle, "padding-right")) - parseInt(gara.Utils.getStyle(this.handle, "border-left-width")) - parseInt(gara.Utils.getStyle(this.handle, "border-right-width"))) + "px" : "auto";
		this.handle.style.height = this._height != null ? (this._height - (this._headerVisible ? this._thead.offsetHeight : 0) - heightSub) + "px" : "";
		this.handle.style.paddingTop = this._headerVisible ? this._thead.offsetHeight + "px" : "0";
		this._scroller.style.height = this._height != null ? (this._height - (this._headerVisible ? this._thead.offsetHeight : 0) - heightSub) + "px" : "auto";


		// adjustments based on measurements
		if (this._items.length) {
			this._items[0]._adjustWidth();
		}

		this._thead.style.display = this._headerVisible ? (document.all ? "block" : "table-row-group") : "none";

	}
});