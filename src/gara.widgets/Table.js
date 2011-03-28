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

gara.provide("gara.widgets.Table", "gara.widgets.Composite");

gara.use("gara.widgets.TableColumn");
gara.use("gara.widgets.TableItem");
gara.use("gara.widgets.Menu");

/**
 * gara Table Widget
 * 
 * @description
 * full description of the gara Table Widget
 *
 * @class gara.widgets.Table
 * @extends gara.widgets.Composite
 */
gara.Class("gara.widgets.Table", function () { return /** @lends gara.widgets.Table# */ {
	$extends : gara.widgets.Composite,

	SCROLLBAR_WIDTH : 19,

	// items
	/**
	 * Contains the <code>Table</code>'s items.
	 *
	 * @private
	 * @type {gara.widgets.TableItem[]}
	 */
	items : [],

	/**
	 * Contains the <code>Table</code>'s columns.
	 *
	 * @private
	 * @type {gara.widgets.TableColumn[]}
	 */
	columns : [],

	/**
	 * Contains the column's order. The indices of the columns are stored
	 * in this array.
	 *
	 * @private
	 * @type {int[]}
	 */
	columnOrder : [],

	/**
	 * This virtual column is used if there are not columns added.
	 *
	 * @private
	 * @type {gara.widgets.TableColumn}
	 */
	virtualColumn : null,
	
	/**
	 * Contains the item, that was active when shift was pressed.
	 *
	 * @private
	 * @type {gara.widgets.TableItem}
	 */
	shiftItem : null,

	/**
	 * Contains the current active item.
	 *
	 * @private
	 * @type {gara.widgets.TableItem}
	 */
	activeItem : null,

	// flags
	/**
	 * Holds the header visible flag.
	 *
	 * @private
	 * @type {boolean}
	 */
	headerVisible : false,

	/**
	 * Holds the lines visible flag.
	 *
	 * @private
	 * @type {boolean}
	 */
	linesVisible : false,

	// nodes
	/**
	 * Table's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	table : null,

	/**
	 * Thead's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	thead : null,

	/**
	 * Thead's row DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	theadRow : null,

	/**
	 * Tbody's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	tbody : null,

	/**
	 * Checkbox column's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	checkboxCol : null,


	// selection
	/**
	 * Contains the selection.
	 *
	 * @private
	 * @type {gara.widgets.TableItem[]}
	 */
	selection : [],

	/**
	 * Contains a collection of listeners that will be notified, when the
	 * selection changes.
	 *
	 * @private
	 * @type {gara.events.SelectionListener[]}
	 */
	selectionListeners : [],


	/**
	 * Creates a new Table
	 * @constructs
	 * @extends gara.widgets.Composite
	 *
	 * @param {gara.widgets.Composite|HTMLElement} parent parent dom node or composite
	 * @param {int} style the style for the table (optional)
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
		this.colgroup = null;
		this.checkboxCol = null;
		this.checkboxCell = null;
		
		this.event = null;
		this.selection = [];
		this.selectionListeners = [];
		this.shiftItem = null;
		this.activeItem = null;

		this.$super(parent, style || gara.SINGLE);
		this.addFocusListener(this);
		this.colMenu = new gara.widgets.Menu(this, gara.widgets.POP_UP);
		this.colMenu.setData(this);
	},

	/**
	 * Activates an item
	 *
	 * @private
	 * @param {gara.widgets.TableItem} item the item that should be activated
	 * @returns {void}
	 */
	activateItem : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.widgets.TableItem)) {
			throw new TypeError("item is not type of gara.widgets.TableItem");
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
	 * Adds an table item to the table.
	 * 
	 * @private
	 * @param {gara.widgets.TableItem} item the item that should be added
	 * @param {int} index the offset where the new item should be inserted (optional)
	 * @returns {HTMLElement} the parent html node for items
	 */
	addItem : function (item, index) {
		this.checkWidget();
		if (!(item instanceof gara.widgets.TableItem)) {
			throw new TypeError("item is not a gara.widgets.TableItem");
		}

		if (typeof(index) !== "undefined") {
			this.items.insertAt(index, item);
		} else {
			this.items.push(item);
		}

		return this.tbody;
	},

	/**
	 * Adds an table column to the table.
	 * 
	 * @private
	 * @param {gara.widgets.TableColumn} column the column that should be added
	 * @param {int} index the offset where the new column should be inserted (optional)
	 * @returns {HTMLElement} the parent html node for columns
	 */
	addColumn : function (column, index) {
		this.checkWidget();
		if (!(column instanceof gara.widgets.TableColumn)) {
			throw new TypeError("column is not a gara.widgets.TableColumn");
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
		
		delete this.colMenu.offsetWidth;

		return this.theadRow;
	},
	
	/**
	 * Gets called whenever a column gets resized. Resizes all items at the column with the 
	 * specified width
	 * 
	 * @private
	 * @param {gara.widgets.TableColumn} column the affected column
	 * @param {int} width the new width 
	 * @returns {void}
	 */
	adjustedColWidth : function (column, width) {
		this.items.forEach(function (item) {
			item.adjustWidth(column, width);
		}, this);
	},

	/*
	 * jsdoc in gara.widgets.Control
	 */
	adjustHeight : function (height) {
		var scrollbar = this.getVerticalScrollbar(), scrollbarVisible, headerHeight;
		
		this.handle.style.height = "auto";
		
//		if (height === null) {
//			height = this.handle.offsetHeight;
//		}
		
		headerHeight = this.getHeaderHeight();
//		height -= headerHeight;
		this.$super(height);
		
		if (height !== null) {
			height = this.handle.clientHeight;
			this.scroller.style.height = (height - headerHeight) + "px";
		} else {
			this.scroller.style.height = "auto";
		}
	
		this.resizeLine.style.top = headerHeight + "px";
		this.handle.style.paddingTop = headerHeight + "px";
		
		this.setClass("garaTableVerticalOverflow", this.getVerticalScrollbar() || height === null);
	},

	/*
	 * jsdoc in gara.widgets.Control
	 */
	adjustWidth : function (width) {
		var colWidths = 0, cols = [], allWidth = 0, hideHeader = false, overflow;
		
		if ((this.getStyle() & gara.CHECK) !== 0) {
			if (!this.headerVisible) {
				this.setHeaderVisible(true);
				hideHeader = true;
			}
			
			allWidth = this.checkboxCell.clientWidth // FF and Webkit have different offsetWidth
				+ gara.getNumStyle(this.checkboxCell, "border-right-width")
				+ gara.getNumStyle(this.checkboxCell, "border-left-width");
			this.checkboxCol.width = allWidth;
			
			if (hideHeader) {
				this.setHeaderVisible(false);
			} 
		}

		overflow = gara.getStyle(this.scrolledHandle(), "overflow");
		this.scrolledHandle().style.overflow = "hidden";
		this.$super(width);
		this.scrolledHandle().style.overflow = overflow;

		width = this.handle.clientWidth - (this.getVerticalScrollbar() ? gara.SCROLLBAR_WIDTH : 0);

		this.columns.forEach(function (col, index) {
			if (col.getVisible()) {
				var colWidth;
				if (!col.getWidth()) {
					cols.add(col);	
				} else {
					col.adjustWidth(col.getWidth());
					allWidth += col.getWidth();
				}
			}
		}, this);
		width -= allWidth;

		cols.forEach(function (col, index) {
			var colWidth = Math.floor(width / cols.length),
				newWidth = index === cols.length - 1 ? width - colWidths : colWidth;
			
			col.adjustWidth(newWidth);
			colWidths += newWidth;
		}, this);
		
		if (this.virtualColumn !== null) {
			colWidths += width; 
			this.virtualColumn.adjustWidth(width);
		}

		allWidth += colWidths + gara.SCROLLBAR_WIDTH;
		
		this.table.style.width = (allWidth - gara.SCROLLBAR_WIDTH) + "px";
		this.thead.style.width = allWidth > this.handle.clientWidth ? allWidth + "px" : "100%";
		this.tbody.style.width = (allWidth - gara.SCROLLBAR_WIDTH) + "px";
		this.setClass("garaTableHorizontalOverflow", allWidth + (this.getVerticalScrollbar() ? gara.SCROLLBAR_WIDTH : 0) >= this.handle.clientWidth);
		
		// adjust items based on new measurements
//		if (this.items.length) {
//			this.items[0].adjustWidth();
//		}
	},

	/**
	 * Adds the listener to the collection of listeners who will be notified 
	 * when the user changes the receiver's selection, by sending it one of 
	 * the messages defined in the <code>SelectionListener</code> interface. 
	 *
	 * @param {gara.events.SelectionListener} listener the listener which should be notified when the user changes the receiver's selection 
	 * @returns {gara.widgets.Table} this
	 */
	addSelectionListener : function (listener) {
		this.checkWidget();
		if (!this.selectionListeners.contains(listener)) {
			this.selectionListeners.add(listener);
		}
		return this;
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	bindListener : function (eventType, listener) {
		gara.addEventListener(this.handle, eventType, listener);
	},

	/**
	 * Clears an item at a given index
	 *
	 * @param {int} index the position of the item
	 * @throws {RangeError} when there is no item at the given index
	 * @returns {void}
	 */
	clear : function (index) {
		this.checkWidget();
		if (typeof(this.items.indexOf(index)) === "undefined") {
			throw new RangeError("There is no item for the given index");
		}
		this.items[index].clear();
	},

	/*
	 * jsdoc in gara.widgets.Control
	 */
	createWidget : function () {
		var self = this;
		this.createHandle("div");
		this.handle.setAttribute("role", "grid");
		this.handle.setAttribute("aria-multiselectable", (this.style & gara.MULTI) === gara.MULTI ? true : false);
		this.handle.setAttribute("aria-activedescendant", this.getId());
		this.handle.setAttribute("aria-readonly", true);
		
		// css
		this.addClass("garaTable");
		this.setClass("garaTableLines", this.linesVisible);
		this.setClass("garaTableNoLines", !this.linesVisible);
		this.setClass("garaTableFullSelection", (this.style & gara.FULL_SELECTION) !== 0);
		this.setClass("garaBorder", (this.style & gara.BORDER) !== 0);

		// nodes
		this.scroller = document.createElement("div");
		this.scroller.id = this.getId() + "-scroller";
		this.scroller.className = "garaTableScroller";
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
		
		// colgroup
		this.colGroup = document.createElement("colgroup");
		this.table.appendChild(this.colGroup);

		// table head
		this.thead = document.createElement("thead");
		this.thead.className = "garaTableHead";
		this.thead.id = this.getId() + "-thead";
		this.thead.widget = this;
		this.thead.control = this;
		this.thead.setAttribute("role", "presentation");
		this.thead.style.display = this.headerVisible ? (document.all ? "block" : "table-row-group") : "none";
		this.table.appendChild(this.thead);

		this.theadRow = document.createElement("tr");
		this.theadRow.className = "garaTableHeadRow";
		this.theadRow.id = this.getId() + "-theadRow";
		this.theadRow.widget = this;
		this.theadRow.control = this;
		this.theadRow.setAttribute("role", "row");
		this.thead.appendChild(this.theadRow);
		
		// if check style
		if ((this.style & gara.CHECK) === gara.CHECK) {
			this.checkboxCol = document.createElement("col");
			this.colGroup.appendChild(this.checkboxCol);
			
			this.checkboxCell = document.createElement("th");
			this.checkboxCell.className = "garaTableHeadCheckboxColumn";
			this.checkboxCell.setAttribute("role", "columnheader");
			this.theadRow.appendChild(this.checkboxCell);
			this.addClass("garaTableCheckbox");
		}

		// table body
		this.tbody = document.createElement("tbody");
		this.tbody.id = this.getId() + "-tbody";
		this.tbody.widget = this;
		this.tbody.control = this;
		this.tbody.setAttribute("role", "presentation");
		this.table.appendChild(this.tbody);

		// arrow
		this.arrow = document.createElement("div");
		this.arrow.className = "garaTableArrow";
		this.arrow.id = this.getId() + "-arrow";
		this.arrow.widget = this;
		this.arrow.control = this;
		this.arrow.setAttribute("role", "presentation");
		this.arrow.style.width = gara.SCROLLBAR_WIDTH + "px";
		this.arrow.style.display = this.headerVisible ? "block" : "none";
		this.arrow.appendChild(document.createElement("span"));
		this.handle.appendChild(this.arrow);
		gara.addEventListener(this.arrow, "mousedown", function (e) {
			var left = 0, top = 0, obj = self.arrow;
			if (self.colMenu.getVisible()) {
				self.colMenu.setVisible(false);
				return false;
			}
			
			if (self.getColumnCount() === 0) {
				return false;
			}
			
			if (!self.colMenu.offsetWidth) {
				self.colMenu.setLocation(-1000, -1000);
				self.colMenu.setVisible(true);
				self.colMenu.offsetWidth = self.colMenu.handle.offsetWidth;
			}

			// find position
			if (obj.offsetParent) {
				do {
					left += obj.offsetLeft - obj.scrollLeft;
					top += obj.offsetTop - obj.scrollTop;
				} while (obj = obj.offsetParent);
			}
			
			self.colMenu.setLocation(left - self.colMenu.offsetWidth + self.arrow.offsetWidth, top + self.arrow.offsetHeight + 2);
			self.colMenu.setVisible(true);
			
			e.stopPropagation();
		});
		
		// resizeLine
		this.resizeLine = document.createElement("div");
		this.resizeLine.className = "garaTableResizeLine";
		this.resizeLine.id = this.getId() + "-resizeLine";
		this.resizeLine.widget = this;
		this.resizeLine.control = this;
		this.resizeLine.setAttribute("role", "presentation");
		this.handle.appendChild(this.resizeLine);

		// listener
		this.addListener("mousedown", this);
		this.addListener("contextmenu", this);
		if ((this.style & gara.CHECK) === gara.CHECK) {
			this.addListener("mouseup", this);
		}
		
		// sync scroll
		gara.addEventListener(this.scroller, "scroll", function (e) {
			self.thead.style.left = (e.target.scrollLeft * -1) +"px";
		});

		// intial width calculation for TableColumns
		//this.theadRow.style.width = this.handle.offsetWidth + "px";
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
		this.checkWidget();
		if (this.selection.length) {
			while (this.selection.length) {
				this.selection.pop().setSelected(false);
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
				if (typeof(this.items.indexOf(index)) === "undefined") {
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
		this.columns = null;
		this.columnOrder = null;
		this.virtualColumn = null;
		this.selection = null;
		this.selectionListeners = null;
		this.shiftItem = null;
		this.activeItem = null;

		this.$super();
	},

	/**
	 * Focus listener. Will be notified when the receiver gets focussed.
	 * 
	 * @private
	 * @param {Event} e
	 * @returns {void}
	 */
	focusGained : function () {
		// mark first item active
		if (this.activeItem === null && this.items.length) {
			this.activateItem(this.items[0]);
		}
	},

	/**
	 * Returns the column at the given, zero-relative index in the receiver.
	 * 
	 * @description
	 * Returns the column at the given, zero-relative index in the receiver. Throws an exception 
	 * if the index is out of range. Columns are returned in the order that they were created. If no 
	 * <code>TableColumn</code>s were created by the programmer, this method will throw a 
	 * <code>RangeError</code> Exception despite the fact that a single column of data may be visible 
	 * in the table. This occurs when the programmer uses the table like a list, adding items but 
	 * never creating a column.
	 *
	 * @see gara.widgets.Table#getColumnOrder
	 * @param {int} index the index of the column to return 
	 * @throws {RangeError} when there is no column at the given index
	 * @returns {gara.widgets.TableColumn} the column at the given index 
	 */
	getColumn : function (index) {
		this.checkWidget();
		if (typeof(this.columns.indexOf(index)) === "undefined" || this.virtualColumn !== null) {
			throw new RangeError("There is no column for the given index");
		}
		return this.columns[index];
	},

	/**
	 * Returns the number of columns contained in the receiver.
	 * 
	 * @description
	 * Returns the number of columns contained in the receiver. If no <code>TableColumn</code>s were 
	 * created by the programmer, this value is zero, despite the fact that visually, one column of 
	 * items may be visible. This occurs when the programmer uses the table like a list, adding 
	 * items but never creating a column.
	 *  
	 * @returns {int} the number of columns 
	 */
	getColumnCount : function () {
		if (this.virtualColumn === null) {
			return this.columns.length;
		} else {
			return 0;
		}
	},

	/**
	 * Returns an array of zero-relative integers that map the creation order of the receiver's columns 
	 * to the order in which they are currently being displayed.
	 * 
	 * @description
	 * <p>Returns an array of zero-relative integers that map the creation order of the receiver's 
	 * columns to the order in which they are currently being displayed.</p>
	 * <p>Specifically, the indices of the returned array represent the current visual order of the 
	 * items, and the contents of the array represent the creation order of the columns.</p>
	 * 
	 * @see gara.widgets.Table#setColumnOrder
	 * @returns {int[]} the current visual order of the receiver's columns 
	 */
	getColumnOrder : function () {
		return this.columnOrder;
	},

	/**
	 * Returns an array of <code>TableColumn</code>s which are the columns in the receiver.
	 * 
	 * @description
	 * Returns an array of <code>TableColumn</code>s which are the columns in the receiver. Columns 
	 * are returned in the order that they were created. If no <code>TableColumn</code>s were created 
	 * by the programmer, the array is empty, despite the fact that visually, one column of items 
	 * may be visible. This occurs when the programmer uses the table like a list, adding items but 
	 * never creating a column.
	 *  
	 * @returns {gara.widgets.TableColumn[]} the columns in the receiver 
	 */
	getColumns : function () {
		return this.columns;
	},
	
	/**
	 * Returns the height of the receiver's header. 
	 * 
	 * @returns {int} the height of the header or zero if the header is not visible 
	 */
	getHeaderHeight : function () {
		return this.theadRow.offsetHeight;
	},

	/**
	 * Returns wether the receiver's header is visible
	 *  
	 * @returns {boolean} <code>true</code> for visible, <code>false</code> for invisible
	 */
	getHeaderVisible : function () {
		return this.headerVisible;
	},

	/**
	 * Returns the item at the given, zero-relative index in the receiver.
	 * 
	 * @description
	 * Returns the item at the given, zero-relative index in the receiver. 
	 * Throws an exception if the index is out of range. 
	 *
	 * @param {int} index the index of the item to return 
	 * @throws {RangeError} if the index is out of bounds
	 * @returns {gara.widgets.TreeItem} the item at the given index
	 */
	getItem : function (index) {
		this.checkWidget();
		if (typeof(this.items.indexOf(index)) === "undefined") {
			throw new RangeError("There is no item for the given index");
		}
		return this.items[index];
	},

	/**
	 * Returns the number of items contained in the receiver. 
	 * 
	 * @returns {int} the number of items.
	 */
	getItemCount : function () {
		return this.items.length;
	},

	/**
	 * Returns the height of a specified item of the receiver. 
	 *
	 * @param {gara.widgets.TableItem} the item of the height to return
	 * @returns {int} the height of one item 
	 */
	getItemHeight : function (item) {
		return item.handle.offsetHeight
			+ gara.getNumStyle(item.handle, "margin-top")
			+ gara.getNumStyle(item.handle, "margin-bottom");
	},

	/**
	 * Returns a (possibly empty) array of TableItems which are the items in the receiver. 
	 * 
	 * @returns {gara.widgets.TableItem[]} the items in the receiver
	 */
	getItems : function () {
		return this.items;
	},

	/**
	 * Returns <code>true</code> if the receiver's lines are visible, and <code>false</code> otherwise. 
	 * 
	 * @returns {boolean} the visibility state of the lines
	 */
	getLinesVisible : function () {
		return this.linesVisible;
	},

	/**
	 * Returns an array of <code>TableItems</code> that are currently selected in the receiver. 
	 * The order of the items is unspecified. An empty array indicates that no items are selected. 
	 *
	 * @returns {gara.widgets.TreeItem[]} an array representing the selection 
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
	 * Returns a <code>TableItem</code> which is currently at the top of the receiver. This 
	 * <code>TableItem</code> can change when items are scrolled or new items are added or removed.
	 * 
	 * @returns {gara.widgets.TableItem} the top item
	 */
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
	 * @private
	 */
	handleEvent : function (e) {
		var widget;
		this.checkWidget();

		// special events for the list
		widget = e.target.widget || null;
		e.item = widget && (widget instanceof gara.widgets.TableItem || widget instanceof gara.widgets.TableColumn) ? widget : this.activeItem;
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

		if (e.type !== "mouseup") {
			e.stopPropagation();
		}
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
			if (item instanceof gara.widgets.TableItem) {
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
	 * @private
	 */
	handleKeyNavigation : function (e) {
		var prev, activeIndex, h, i, viewport, itemAddition, next, min, scrollRange;
		switch (e.keyCode) {

		// up
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
		case gara.ARROW_DOWN:

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
		case gara.END:
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
	 * Searches the receiver's list starting at the first item (index 0) until an item is found that 
	 * is equal to the argument, and returns the index of that item. If no item is found, returns -1.  
	 *
	 * @param {gara.widgets.TableItem} item the search item 
	 * @throws {TypeError} if the item is not a {@link gara.widgets.TableItem}
	 * @returns {int} the index of the item 
	 */
	indexOf : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.widgets.TableItem)) {
			throw new TypeError("item not instance of gara.widgets.TableItem");
		}

		return this.items.indexOf(item);
	},

	/*
	 * jsdoc in gara.widgets.Scrollable
	 */
	getVerticalScrollbar : function () {
		return this.tbody.clientHeight > this.scroller.clientHeight;
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

	/*
	 * jsdoc in gara.widgets.Composite
	 */
	releaseChildren : function () {
		this.items.forEach(function (item) {
			item.release();
		}, this);
		
		this.columns.forEach(function (column) {
			column.release();
		}, this);
		
		//this.$super();
	},
	
	/**
	 * Releases a column from the receiver.
	 *
	 * @private
	 * @param {gara.widgets.TableColumn} column the column that should released from the receiver
	 * @returns {void}
	 */
	releaseColumn : function (column) {
		if (this.columns.contains(column)) {
			this.theadRow.removeChild(column.handle);
			this.columns.remove(column);
		}
	},
	
	/**
	 * Releases an item from the receiver.
	 *
	 * @private
	 * @param {gara.widgets.TableItem} item the item that should released from the receiver
	 * @returns {void}
	 */
	releaseItem : function (item) {
		if (this.items.contains(item)) {
			this.tbody.removeChild(item.handle);
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
		this.releaseItem(this.items[index]);
	},

	/**
	 * Removes all items from the receiver.
	 *
	 * @returns {void}
	 */
	removeAll : function () {
		var item;
		this.checkWidget();
		while (this.items.length) {
			item = this.items.pop();
			this.releaseItem(item);
		}
	},
	
	/**
	 * Removes items which indices are passed by an array
	 *
	 * @param {int[]} indices the array with the indices
	 * @returns {void}
	 */
	removeArray : function (indices) {
		this.checkWidget();
		indices.forEach(function (index) {
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
	 * @returns {gara.widgets.Table} this
	 */
	removeSelectionListener : function (listener) {
		this.checkWidget();
		this.selectionListeners.remove(listener);
		return this;
	},

	/*
	 * jsdoc in gara.widgets.Scrollable
	 */
	scrolledHandle : function () {
		return this.scroller;
	},

	/**
	 * Selects an item.
	 *
	 * @see gara.widgets.Table#selectAll
	 * @see gara.widgets.Table#selectArray
	 * @see gara.widgets.Table#selectRange
	 * @see gara.widgets.Table#setSelection
	 * @param {int} index the item that should be selected
	 * @throws {RangeError} if the index is out of bounds
	 * @returns {void}
	 */
	select : function (index) {
		this.checkWidget();

		// return if index are out of bounds
		if (index < 0 || index >= this.items.length) {
			throw new RangeError("index out of bounds");
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
	 * Selects an item
	 *
	 * @private
	 * @param {gara.widgets.TableItem} item the item that should be selected
	 * @throws {TypeError} if the item is not a {@link gara.widgets.TableItem}
	 * @return {void}
	 */
	selectAdd : function (item, add) {
		this.checkWidget();
		if (!(item instanceof gara.widgets.TableItem)) {
			throw new TypeError("item not instance of gara.widgets.TableItem");
		}

		if (!add || (this.style & gara.MULTI) !== gara.MULTI) {
			while (this.selection.length) {
				this.selection.pop().setSelected(false);
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
	 * @see gara.widgets.Table#select
	 * @see gara.widgets.Table#selectArray
	 * @see gara.widgets.Table#selectRange
	 * @see gara.widgets.Table#setSelection
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
	 * @see gara.widgets.Table#select
	 * @see gara.widgets.Table#selectAll
	 * @see gara.widgets.Table#selectRange
	 * @see gara.widgets.Table#setSelection
	 * @param {int[]} indices an array with zero-related indices
	 * @returns {void}
	 */
	selectArray : function (indices) {
		if (!indices.length) {
			return;
		}

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
	 * @see gara.widgets.Table#select
	 * @see gara.widgets.Table#selectAll
	 * @see gara.widgets.Table#selectArray
	 * @see gara.widgets.Table#setSelection
	 * @param {int} from range start
	 * @param {int} to range end
	 * @returns {void}
	 */
	selectRange : function (from, to) {
		var i;
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
	 * @param {gara.widgets.TableItem} item the item that should be selected
	 * @throws {TypeError} if the item is not a {@link gara.widgets.TableItem}
	 * @returns {void}
	 */
	selectShift : function (item, add) {
		var indexShift, indexItem, from, to, i;
		this.checkWidget();
		if (!(item instanceof gara.widgets.TableItem)) {
			throw new TypeError("item is not type of gara.widgets.TableItem");
		}

		if (!add) {
			while (this.selection.length) {
				this.selection.pop().setSelected(false);
			}
		}

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
	 * Sets the selection on the receiver. The current selection is cleared before the new items are selected. 
	 *
	 * @see gara.widgets.Table#deselectAll
	 * @param {gara.widgets.TableItem[]|gara.widgets.TableItem} items the array with the <code>TableItem</code> items
	 * @returns {gara.widgets.Table} this
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

		} else if (items instanceof gara.widgets.TableItem) {
			this.select(this.indexOf(items));
		}
		return this;
	},

	/**
	 * Sets the order that the items in the receiver should be displayed in to the 
	 * given argument which is described in terms of the zero-relative ordering of 
	 * when the items were added. 
	 * 
	 * @see gara.widgets.Table#getColumnOrder 
	 * @param {int[]} order the new order to display the items 
	 * @returns {gara.widgets.Table} this
	 */
	setColumnOrder : function (order) {
		this.columnOrder = order;
		return this;
	},

	/**
	 * Marks the receiver's header as visible if the argument is <code>true</code>, and
	 * marks it invisible otherwise. 
	 * 
	 * @param {boolean} show the new visibility state 
	 * @returns {gara.widgets.Table} this
	 */
	setHeaderVisible : function (show) {
		this.headerVisible = show;
		this.thead.style.display = this.headerVisible ? "table-row-group" : "none";
		this.arrow.style.display = this.headerVisible ? "block" : "none";
		
		this.adjustHeight(this.getHeight() || (this.parent instanceof gara.widgets.Composite 
			? this.handle.offsetHeight
			: null));
		return this;
	},

	/**
	 * Marks the receiver's lines as visible if the argument is <code>true</code>, and 
	 * marks it invisible otherwise.
	 *  
	 * @param {boolean} show the new visibility state 
	 * @returns {gara.widgets.Table} this
	 */
	setLinesVisible : function (show) {
		this.linesVisible = show;
		this.setClass("garaTableLines", this.linesVisible);
		this.setClass("garaTableNoLines", !this.linesVisible);
		return this;
	},

	/**
	 * Sets the item which is currently at the top of the receiver. This item can 
	 * change when items are scrolled or new items are added and removed. 
	 * 
	 * @param {gara.widgets.TableItem} item the top item
	 * @returns {gara.widgets.Table} this
	 */
	setTopItem : function (item) {
		var index, h = 0, i;
		if (!(item instanceof gara.widgets.TableItem)) {
			throw new TypeError("item not instance of gara.widgets.TableItem");
		}

		index = this.indexOf(item);
		for (i = 0; i < index; i++) {
			h += this.getItemHeight(this.items[index]);
		}

		this.scrolledHandle().scrollTop = h;
		return this;
	},

	/**
	 * Shows the item. If the item is already showing in the receiver, this method 
	 * simply returns. Otherwise, the items are scrolled until the item is visible.
	 *  
	 * @see gara.widgets.Table#showSelection
	 * @param {gara.widgets.TableItem} item the item to be shown
	 * @returns {void}
	 */
	showItem : function (item) {
		var index, h, i, newScrollTop;
		if (!(item instanceof gara.widgets.TableItem)) {
			throw new TypeError("item not instance of gara.widgets.TableItem");
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
	 * Shows the selection. If the selection is already showing in the receiver, this 
	 * method simply returns. Otherwise, the items are scrolled until the selection is 
	 * visible.
	 * 
	 * @see gara.widgets.Table#showItem
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

	/*
	 * jsdoc in gara.widgets.Control
	 */
	update : function () {
		var i, col, len;
		this.checkWidget();

		// -- update table head
		
		// removing nodes
		if (this.virtualColumn && this.columns.length) {
			this.virtualColumn.dispose();
			this.virtualColumn = null;
		}
		
		while (this.colGroup.childNodes.length) {
			this.colGroup.removeChild(this.colGroup.childNodes[0]);
		}
		
		while (this.theadRow.childNodes.length && this.columns.length) {
			this.theadRow.removeChild(this.theadRow.childNodes[0]);
		}

		// adding nodes
		if ((this.style & gara.CHECK) === gara.CHECK) {
			this.theadRow.appendChild(this.checkboxCell);
			this.colGroup.appendChild(this.checkboxCol);
		}

		// add virtual column if no columns present
		if (!this.columns.length) {
			this.virtualColumn = new gara.widgets.TableColumn(this);
			this.columns = [];
			this.columnOrder = [];
		}

		// adding cols
		for (i = 0, len = this.columnOrder.length; i < len; ++i) {
			col = this.columns[this.columnOrder[i]];

			if (col.isDisposed()) {
				this.releaseColumn(col);
			} else if (col.getVisible()) {
				this.theadRow.appendChild(col.handle);
				this.colGroup.appendChild(col.col);
			}
		}

		// setting col width
//		for (i = 0, len = this.columnOrder.length; i < len; ++i) {
//			col = this.columns[this.columnOrder[i]];
//			col.setWidth(col.getWidth() /*+ (i === (len - 1) && this.getVerticalScrollbar() ? 19 : 0)*/);
//		}

		// update items
		this.items.forEach(function (item) {
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
		this.adjustHeight(this.getHeight() || (this.parent instanceof gara.widgets.Composite 
			? this.handle.offsetHeight
			: null));
		this.adjustWidth(this.handle.offsetWidth);
	}
};});