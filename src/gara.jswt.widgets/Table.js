/*	$Id $

		gara - Javascript Toolkit
	================================================================================================================

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

	================================================================================================================
*/

gara.provide("gara.jswt.widgets.Table");

gara.use("gara.EventManager");
gara.use("gara.jswt.JSWT");

gara.parent("gara.jswt.widgets.Composite",

/**
 * gara Table Widget
 *
 * @class Table
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @extends gara.jswt.widgets.Composite
 */
function() {gara.Class("gara.jswt.widgets.Table", {
	$extends : gara.jswt.widgets.Composite,

	SCROLLBAR_WIDTH : 19,

	// items
	/**
	 * @field
	 * Contains the <code>Table</code>'s items.
	 *
	 * @private
	 * @type {gara.jswt.widgets.TableItem[]}
	 */
	items : [],

	/**
	 * @field
	 * Contains the <code>Table</code>'s columns.
	 *
	 * @private
	 * @type {gara.jswt.widgets.TableColumn[]}
	 */
	columns : [],

	/**
	 * @field
	 * Contains the column's order. The indices of the columns are stored
	 * in this array.
	 *
	 * @private
	 * @type {int[]}
	 */
	columnOrder : [],

	/**
	 * @field
	 * This virtual column is used if there are not columns added.
	 *
	 * @private
	 * @type {gara.jswt.widgets.TableColumn}
	 */
	virtualColumn : null,

	// flags
	/**
	 * @field
	 * Holds the header visible flag.
	 *
	 * @private
	 * @type {boolean}
	 */
	headerVisible : false,

	/**
	 * @field
	 * Holds the lines visible flag.
	 *
	 * @private
	 * @type {boolean}
	 */
	linesVisible : false,

	// nodes
	/**
	 * @field
	 * Table's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	table : null,

	/**
	 * @field
	 * Thead's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	thead : null,

	/**
	 * @field
	 * Thead's row DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	theadRow : null,

	/**
	 * @field
	 * Tbody's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	tbody : null,

	/**
	 * @field
	 * Checkbox column's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	checkboxCol : null,


	/**
	 * @field
	 * Contains the selection.
	 *
	 * @private
	 * @type {gara.jswt.widgets.TableItem[]}
	 */
	selection : [],

	/**
	 * @field
	 * Contains a collection of listeners that will be notified, when the
	 * selection changes.
	 *
	 * @private
	 * @type {gara.jswt.events.SelectionListener[]}
	 */
	selectionListeners : [],

	/**
	 * @field
	 * Contains the item, that was active when shift was pressed.
	 *
	 * @private
	 * @type {gara.jswt.widgets.TableItem}
	 */
	shiftItem : null,

	/**
	 * @field
	 * Contains the current active item.
	 *
	 * @private
	 * @type {gara.jswt.widgets.TableItem}
	 */
	activeItem : null,

	/**
	 * @constructor
	 *
	 * @param {gara.jswt.widgets.Composite|HTMLElement} parent parent dom node or composite
	 * @param {int} style The style for the list
	 */
	$constructor : function (parent, style) {
		// items
		this.items = [];
		this.columns = [];
		this.columnOrder = [];
		this.virtualColumn = null;

		// flags
		this.headerVisible = false;
		this.linesVisible = false;

		// nodes
		this.table = null;
		this.thead = null;
		this.theadRow = null;
		this.tbody = null;
		this.checkboxCol = null;

		this.event = null;
		this.selection = [];
		this.selectionListeners = [];
		this.shiftItem = null;
		this.activeItem = null;

		this.$super(parent, style || gara.jswt.JSWT.SINGLE);
	},

	/**
	 * @method
	 *
	 * @private
	 */
	activateItem : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.jswt.widgets.TableItem)) {
			throw new TypeError("item is not type of gara.jswt.widgets.TableItem");
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
	 *
	 * @private
	 */
	addItem : function (item, index) {
		this.checkWidget();
		if (!(item instanceof gara.jswt.widgets.TableItem)) {
			throw new TypeError("item is not a gara.jswt.widgets.TableItem");
		}

		if (typeof(index) !== "undefined") {
			this.items.insertAt(index, item);
		} else {
			this.items.push(item);
		}

		return this.tbody;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	addColumn : function (column, index) {
		this.checkWidget();
		if (!(column instanceof gara.jswt.widgets.TableColumn)) {
			throw new TypeError("column is not a gara.jswt.widgets.TableColumn");
		}

		if (index) {
			this.columns[index] = column;
			if (!this.columnOrder.contains(index)) {
				this.columnOrder.push(index);
			}
		} else {
			this.columns.push(column);
			this.columnOrder.push(this.columns.length - 1);
		}

		return this.theadRow;
	},

	/**
	 * @method
	 * Adds a selection listener on the table
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.SelectionListener} listener the desired listener to be added to this table
	 * @return {void}
	 */
	addSelectionListener : function (listener) {
		if (!this.selectionListeners.contains(listener)) {
			this.selectionListeners.push(listener);
		}
	},

	/**
	 * @method
	 *
	 * @private
	 */
	bindListener : function (eventType, listener) {
		gara.EventManager.addListener(this.handle, eventType, listener);
	},

	/**
	 * @method
	 * Clears an item at a given index
	 *
	 * @author Thomas Gossmann
	 * @param {int} index the position of the item
	 * @throws {RangeError} when there is no item at the given index
	 * @return {void}
	 */
	clear : function (index) {
		this.checkWidget();
		if (typeof(this.items.indexOf(index)) == "undefined") {
			throw new RangeError("There is no item for the given index");
		}
		this.items[index].clear();
	},

	/**
	 * @method
	 *
	 * @private
	 */
	createWidget : function () {
		this.createHandle("div");
		this.handle.setAttribute("role", "grid");
		this.handle.setAttribute("aria-multiselectable", (this.style & gara.jswt.JSWT.MULTI) === gara.jswt.JSWT.MULTI ? true : false);
		this.handle.setAttribute("aria-activedescendant", this.getId());
		this.handle.setAttribute("aria-readonly", true);

		// css
		this.addClass("jsWTTable");
		this.setClass("jsWTTableLines", this.linesVisible);
		this.setClass("jsWTTableNoLines", !this.linesVisible);

		// nodes
		this.scroller = document.createElement("div");
		this.scroller.id = this.getId() + "-scroller";
		this.scroller.className = "scroller";
		this.scroller.widget = this;
		this.scroller.control = this;
		this.scroller.setAttribute("role", "presentation");
		this.handle.appendChild(this.scroller);

		this.table = document.createElement("table");
		this.table.id = this.getId() + "-table";
		this.table.widget = this;
		this.table.control = this;
		this.table.setAttribute("role", "presentation");
		this.scroller.appendChild(this.table);

		// table head
		this.thead = document.createElement("thead");
		this.thead.id = this.getId() + "-thead";
		this.thead.widget = this;
		this.thead.control = this;
		this.thead.setAttribute("role", "presentation");
		this.table.appendChild(this.thead);

		this.theadRow = document.createElement("tr");
		this.theadRow.id = this.getId() + "-theadRow";
		this.theadRow.widget = this;
		this.theadRow.control = this;
		this.theadRow.setAttribute("role", "row");
		this.thead.appendChild(this.theadRow);

		// if check style
		if ((this.style & gara.jswt.JSWT.CHECK) === gara.jswt.JSWT.CHECK) {
			this.checkboxCol = document.createElement("th");
			this.checkboxCol.className = "jsWTTableCheckboxCol";
			this.checkboxCol.setAttribute("role", "columnheader");
			this.theadRow.appendChild(this.checkboxCol);
			this.addClass("jsWTTableCheckbox");
		}

		// table body
		this.tbody = document.createElement("tbody");
		this.tbody.id = this.getId() + "-tbody";
		this.tbody.widget = this;
		this.tbody.control = this;
		this.tbody.setAttribute("role", "presentation");
		this.table.appendChild(this.tbody);

		if ((this.style & gara.jswt.JSWT.FULL_SELECTION) === gara.jswt.JSWT.FULL_SELECTION) {
			this.tbody.className = "jsWTTableFullSelection";
		}

		// listener
		this.addListener("mousedown", this);
		if ((this.style & gara.jswt.JSWT.CHECK) === gara.jswt.JSWT.CHECK) {
			this.addListener("mouseup", this);
		}

		// intial width calculation for TableColumns
		//this.theadRow.style.width = this.handle.offsetWidth + "px";
	},


	/**
	 * @method
	 * Deselects an item
	 *
	 * @author Thomas Gossmann
	 * @param {int} index item at zero-related index that should be deselected
	 * @throws {RangeError} when there is no item at the given index
	 * @return {void}
	 */
	deselect : function (index) {
		var item;
		this.checkWidget();

		// return if index are out of bounds
		if (typeof(this.items.indexOf(index)) == "undefined") {
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
	 * @method
	 * Deselects all items in the <code>List</code>
	 *
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	deselectAll : function () {
		this.checkWidget();
		if (this.selection.length) {
			while (this.selection.length) {
				this.selection.pop().setSelected(false);
			}
			this.notifySelectionListener();
		}
	},

	deselectArray : function (indices) {
		if (this.selection.length) {
			indices.forEach(function (index) {
				if (typeof(this.items.indexOf(index)) == "undefined") {
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

		this.columns.forEach(function (col, index, arr) {
			col.dispose();
		}, this);

		this.items.forEach(function (item, index, arr) {
			item.dispose();
		}, this);

		this.thead.removeChild(this.theadRow);
		this.table.removeChild(this.thead);
		this.table.removeChild(this.tbody);
		this.scroller.removeChild(this.table);
		this.handle.removeChild(this.scroller);

		if (this.parentNode !== null) {
			this.parentNode.removeChild(this.handle);
		}

		delete this.theadRow;
		delete this.thead;
		delete this.tbody;
		delete this.table;
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
	 *
	 * @throws {RangeError} when there is no column at the given index
	 */
	getColumn : function (index) {
		this.checkWidget();
		if (typeof(this.columns.indexOf(index)) == "undefined") {
			throw new RangeError("There is no column for the given index");
		}
		return this.columns[index];
	},

	getColumnCount : function () {
		return this.columns.length;
	},

	getColumnOrder : function () {
		return this.columnOrder;
	},

	getColumns : function () {
		return this.columns;
	},

	getHeaderVisible : function () {
		return this.headerVisible;
	},

	/**
	 * @method
	 * Gets a specified item with a zero-related index
	 *
	 * @author Thomas Gossmann
	 * @param {int} index the zero-related index
	 * @throws {RangeError} when there is no item at the given index
	 * @return {gara.jswt.widgets.TreeItem} the item
	 */
	getItem : function (index) {
		this.checkWidget();
		if (typeof(this.items.indexOf(index)) == "undefined") {
			throw new RangeError("There is no item for the given index");
		}
		return this.items[index];
	},

	getItemCount : function () {
		return this.items.length;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	getItemHeight : function (item) {
		return item.handle.offsetHeight
			+ gara.getNumStyle(item.handle, "margin-top")
			+ gara.getNumStyle(item.handle, "margin-bottom");
	},

	getItems : function () {
		return this.items;
	},

	getLinesVisible : function () {
		return this.linesVisible;
	},

	/**
	 * @method
	 * Returns an array with the items which are currently selected in the table
	 *
	 * @author Thomas Gossmann
	 * @return {gara.jswt.widgets.TreeItem[]}an array with items
	 */
	getSelection : function () {
		return this.selection;
	},

	/**
	 * @method
	 * Returns the amount of the selected items in the table
	 *
	 * @author Thomas Gossmann
	 * @return {int} the amount
	 */
	getSelectionCount : function () {
		return this.selection.length;
	},

	getTopItem : function () {
		var scrollTop = this.scrolledHandle().scrollTop,
			h = 0, i;
		if (!this.items.length) {
			return null;
		}

		for (i = 0; i < this.items.length; i++) {
			h += this.getItemHeight(this.items[i]);
			if (h > scrollTop) {
				return this.items[i];
			}
		}
	},

	/**
	 * @method
	 *
	 * @private
	 */
	handleEvent : function (e) {
		var widget;
		this.checkWidget();

		// special events for the list
		widget = e.target.widget || null;
		e.item = widget && (widget instanceof gara.jswt.widgets.TableItem || widget instanceof gara.jswt.widgets.TableColumn) ? widget : this.activeItem;
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

		if (e.type !== "mouseup") {
			e.stopPropagation();
		}
		/* in case of ie6, it is necessary to return false while the type of
		 * the event is "contextmenu" and the menu isn't hidden in ie6
		 */
		return false;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	handleMouseEvents : function (e) {
		var item = e.item;
		switch (e.type) {
		case "mousedown":
			if (item instanceof gara.jswt.widgets.TableItem) {
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
	 * @method
	 *
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
	 *
	 * @private
	 */
	handleKeyNavigation : function (e) {
		var prev, activeIndex, h, i, viewport, itemAddition, next, min;
		switch (e.keyCode) {

		// up
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
				viewport = this.scroller.clientHeight + this.scroller.scrollTop
					- gara.getNumStyle(this.scroller, "padding-top")
					- gara.getNumStyle(this.scroller, "padding-bottom");
				itemAddition = prev.handle.clientHeight
					- gara.getNumStyle(prev.handle, "padding-top")
					- gara.getNumStyle(prev.handle, "padding-bottom");

				this.scroller.scrollTop = h < this.scroller.scrollTop ? h : (viewport < h ? h - viewport + itemAddition : this.scroller.scrollTop);


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
		case gara.jswt.JSWT.ARROW_DOWN:

			// determine next item
			next = false;
			activeIndex = this.indexOf(this.activeItem);

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
				viewport = this.scroller.clientHeight + this.scroller.scrollTop
					- gara.getNumStyle(this.scroller, "padding-top")
					- gara.getNumStyle(this.scroller, "padding-bottom");
				scrollRange = h - this.scroller.clientHeight
					+ gara.getNumStyle(this.scroller, "padding-top")
					+ gara.getNumStyle(this.scroller, "padding-bottom");

				this.scroller.scrollTop = h > viewport ? (scrollRange < 0 ? 0 : scrollRange) : (this.scroller.scrollTop > min ? min : this.scroller.scrollTop);


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
			this.scroller.scrollTop = 0;

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
			this.scroller.scrollTop = this.scroller.scrollHeight - this.scroller.clientHeight;

			if (!e.ctrlKey && !e.shiftKey) {
				this.activateItem(this.items[this.items.length - 1]);
				this.selectAdd(this.items[this.items.length - 1], false);
			} else if (e.shiftKey) {
				this.activateItem(this.items[this.items.length - 1]);
				this.selectShift(this.items[this.items.length - 1], false);
			} else if (e.ctrlKey) {
				this.activateItem(this.items[this.items.length - 1]);
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
	indexOf : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.jswt.widgets.TableItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.TableItem");
		}

		return this.items.indexOf(item);
	},

	getVerticalScrollbar : function () {
		return this.tbody.clientHeight > this.scroller.clientHeight;
	},

	/**
	 * @method
	 * Notifies all selection listeners about the selection change
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
	 * Removes an item from the table
	 *
	 * @author Thomas Gossmann
	 * @param {int} index the index of the item
	 * @return {void}
	 */
	remove : function (index) {
		var item;
		this.checkWidget();
		item = this.items.removeAt(index)[0];
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
	removeArray : function (indices) {
		this.checkWidget();
		indices.forEach(function (index) {
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
	removeAll : function () {
		var item;
		this.checkWidget();
		while (this.items.length) {
			item = this.items.pop();
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
	removeRange : function (start, end) {
		var i;
		this.checkWidget();
		for (i = start; i <= end; ++i) {
			this.remove(start);
		}
	},

	/**
	 * @method
	 * Removes a selection listener from this table
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.SelectionListener} listener the listener to be removed from this table
	 * @return {void}
	 */
	removeSelectionListener : function (listener) {
		this.selectionListeners.remove(listener);
	},

	/**
	 * @method
	 *
	 * @private
	 */
	scrolledHandle : function () {
		return this.scroller;
	},

	/**
	 * @method
	 * Selects an item
	 *
	 * @author Thomas Gossmann
	 * @param {int} index the index of the Item that should be selected
	 * @throws {RangeError} when there is no item at the given index
	 * @return {void}
	 */
	select : function (index) {
		this.checkWidget();

		// return if index are out of bounds
		if (typeof(this.items.indexOf(index)) == "undefined") {
			throw new RangeError("There is no item for the given index");
		}

		var item = this.items[index];
		if (!this.selection.contains(item)) {
			item.setSelected(true);
			this.selection.push(item);
			this.shiftItem = item;
			this.notifySelectionListener();
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
	selectAdd : function (item, add) {
		this.checkWidget();
		if (!(item instanceof gara.jswt.widgets.TableItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.TableItem");
		}

		if (!add || (this.style & gara.jswt.JSWT.MULTI) !== gara.jswt.JSWT.MULTI) {
			while (this.selection.length) {
				this.selection.pop().setSelected(false);
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
	 * Selects a Range of items. From shiftItem to the passed item.
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.widgets.TableItem} item the item
	 * @return {void}
	 */
	selectShift : function (item, add) {
		var indexShift, indexItem, from, to;
		this.checkWidget();
		if (!(item instanceof gara.jswt.widgets.TableItem)) {
			throw new TypeError("item is not type of gara.jswt.widgets.TableItem");
		}

		if (!add) {
			while (this.selection.length) {
				this.selection.pop().setSelected(false);
			}
		}

		if ((this.style & gara.jswt.JSWT.MULTI) === gara.jswt.JSWT.MULTI) {
			indexShift = this.indexOf(this.shiftItem);
			indexItem = this.indexOf(item);
			from = indexShift > indexItem ? indexItem : indexShift;
			to = indexShift < indexItem ? indexItem : indexShift;

			for (var i = from; i <= to; ++i) {
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
	 * Sets the selection of the <code>Table</code>
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.widgets.TableItem[]|gara.jswt.widgets.TableItem} items an array or single <code>TableItem</code>
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

		} else if (items instanceof gara.jswt.widgets.TableItem) {
			this.select(this.indexOf(items));
		}
		return this;
	},

	setColumnOrder : function (order) {
		this.columnOrder = order;
		return this;
	},

	setHeaderVisible : function (show) {
		this.headerVisible = show;
		if (this.thead !== null) {
			this.thead.style.display = this.headerVisible ? (document.all ? "block" : "table-row-group") : "none";
		}
		return this;
	},

	setHeight : function (height) {
		this.height = height;
		heightSub = gara.getNumStyle(this.handle, "padding-bottom") + gara.getNumStyle(this.handle, "border-top-width") + gara.getNumStyle(this.handle, "border-bottom-width");
		this.handle.style.height = this.height !== null ? (this.height - this.thead.offsetHeight - heightSub) + "px" : "auto";
		this.scroller.style.height = this.height !== null ? (this.height - this.thead.offsetHeight - heightSub) + "px" : "auto";
		if (this.headerVisible) {
			this.handle.style.paddingTop = this.thead.offsetHeight + "px";
		}
		return this;
	},

	setLinesVisible : function (show) {
		this.linesVisible = show;
		this.setClass("jsWTTableLines", this.linesVisible);
		this.setClass("jsWTTableNoLines", !this.linesVisible);
		return this;
	},

	setTopItem : function (item) {
		var index, h = 0, i;
		if (!(item instanceof gara.jswt.widgets.TableItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.TableItem");
		}

		index = this.indexOf(item);
		for (i = 0; i < index; i++) {
			h += this.getItemHeight(this.items[index]);
		}

		this.scrolledHandle().scrollTop = h;
		return this;
	},

	setWidth : function (width) {
		var colWidths;
		if (width !== null) {
			this.width = width;
			width = width - gara.getNumStyle(this.handle, "padding-left") - gara.getNumStyle(this.handle, "padding-right") - gara.getNumStyle(this.handle, "border-left-width") - gara.getNumStyle(this.handle, "border-right-width");
			this.handle.style.width = width + "px";
			this.thead.style.width = width + "px";
			colWidths = 0;
			this.columns.forEach(function (col, index) {
				var colWidth;
				if (!col.getWidth()) {
					colWidth = Math.floor(width / this.columns.length);
					colWidths += colWidth;
					col.setWidth(index === this.columns.length - 1 ? width - colWidths : colWidth);
				}
			}, this);
		} else {
			this.handle.style.width = "auto";
			this.width = this.handle.offsetWidth;
			this.thead.style.width = this.width - gara.getNumStyle(this.handle, "padding-left") - gara.getNumStyle(this.handle, "padding-right") - gara.getNumStyle(this.handle, "border-left-width") - gara.getNumStyle(this.handle, "border-right-width") + "px";
		}
		return this;
	},

	showItem : function (item) {
		var index, h, i, newScrollTop;
		if (!(item instanceof gara.jswt.widgets.TableItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.TableItem");
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

	/**
	 * @method
	 * Unregister listeners for this widget. Implementation for gara.jswt.widgets.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	unbindListener : function (eventType, listener) {
		gara.EventManager.removeListener(this.handle, eventType, listener);
	},

	update : function () {
		var i, col;
		this.checkWidget();

		// update table head
//		this.thead.style.position = "static";

		if (this.virtualColumn && this.columns.length) {
			this.virtualColumn.dispose();
			this.virtualColumn = null;
		}
		while (this.theadRow.childNodes.length && this.columns.length) {
			this.theadRow.removeChild(this.theadRow.childNodes[0]);
		}

		if ((this.style & gara.jswt.JSWT.CHECK) === gara.jswt.JSWT.CHECK) {
			this.theadRow.appendChild(this.checkboxCol);
		}

		// add virtual column if no columns present
		if (!this.columns.length) {
			this.virtualColumn = new gara.jswt.widgets.TableColumn(this);
			this.columns = [];
			this.columnOrder = [];
		}

		// adding cols
		for (i = 0, len = this.columnOrder.length; i < len; ++i) {
			var col = this.columns[this.columnOrder[i]];

			if (col.isDisposed()) {
				this.columns.remove(col);
			} else {
				col.update();
				this.theadRow.appendChild(col.handle);
			}
		}

		// setting col width
		for (i = 0, len = this.columnOrder.length; i < len; ++i) {
			col = this.columns[this.columnOrder[i]];
			col.setWidth(col.getWidth() + (i === (len - 1) && this.getVerticalScrollbar() ? 19 : 0));
		}

		// update items
		this.items.forEach(function (item, index, arr) {
			item.update();
		}, this);

//		this.thead.style.position = "absolute";

		// update measurements
		this.updateMeasurements();
	},

	/**
	 * @method
	 *
	 * @private
	 */
	updateMeasurements : function () {
		var width, heightSub;
		// width
		if (this.width !== null) {
			width = this.width - gara.getNumStyle(this.handle, "padding-left") - gara.getNumStyle(this.handle, "padding-right") - gara.getNumStyle(this.handle, "border-left-width") - gara.getNumStyle(this.handle, "border-right-width");
			this.handle.style.width = width + "px";
			this.thead.style.width = width + "px";
		}

		// height
		heightSub = gara.getNumStyle(this.handle, "padding-bottom") + gara.getNumStyle(this.handle, "border-top-width") + gara.getNumStyle(this.handle, "border-bottom-width");
		this.handle.style.height = this.height !== null ? (this.height - this.thead.offsetHeight - heightSub) + "px" : "auto";
		this.scroller.style.height = this.height !== null ? (this.height - this.thead.offsetHeight - heightSub) + "px" : "auto";
		if (this.headerVisible) {
			this.handle.style.paddingTop = this.thead.offsetHeight + "px";
		}

		// adjust items based on new measurements
		if (this.items.length) {
			this.items[0].adjustWidth();
		}
	}
})});