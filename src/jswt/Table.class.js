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

/**
 * gara Table Widget
 *
 * @class Table
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @extends gara.jswt.Composite
 */
$class("Table", {
	$extends : gara.jswt.Composite,

	/**
	 * @constructor
	 *
	 * @param {gara.jswt.Composite|HTMLElement} parent parent dom node or composite
	 * @param {int} style The style for the list
	 */
	$constructor : function(parent, style) {
		this.$base(parent, style);

		// Table default style
		if (this._style == JSWT.DEFAULT) {
			this._style = JSWT.SINGLE;
		}

		// items
		this._items = [];
		this._columns = [];
		this._columnOrder = [];

		// flags
		this._headerVisible = false;
		this._linesVisible = false;

		// nodes
		this._table = null;
		this._thead = null;
		this._theadRow = null;
		this._tbody = null;
		this._checkboxCol = null;

		this._className = this._baseClass = "jsWTTable";
		this._className += " jsWTTableInactive";

		this._event = null;
		this._selection = [];
		this._selectionListener = [];
		this._shiftItem = null;
		this._activeItem = null;
	},

	_activateItem : function(item) {
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.TableItem)) {
			throw new TypeError("item is not type of gara.jswt.TableItem");
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

	_addItem : function(item, index) {
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.TableItem)) {
			throw new TypeError("item is not a gara.jswt.TableItem");
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
		if (!$class.instanceOf(column, gara.jswt.TableColumn)) {
			throw new TypeError("column is not a gara.jswt.TableColumn");
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
	 * @param {gara.jswt.SelectionListener} listener the desired listener to be added to this table
	 * @throws {TypeError} if the listener is not a SelectionListener
	 * @return {void}
	 */
	addSelectionListener : function(listener) {
		if (!$class.instanceOf(listener, gara.jswt.SelectionListener)) {
			throw new TypeError("listener is not type of gara.jswt.SelectionListener");
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
		var item = this._items[index];
		item.clear();
	},

	_create : function() {
		this.domref = document.createElement("div");
		this.domref.className = this._className;
		base2.DOM.EventTarget(this.domref);

		this._scroller = document.createElement("div");
		this._scroller.className = "scroller";
		base2.DOM.EventTarget(this._scroller);
		this.domref.appendChild(this._scroller);

		this._table = document.createElement("table");
		this._table.obj = this;
		this._table.control = this;
		base2.DOM.EventTarget(this._table);
		this._scroller.appendChild(this._table);

		// table head
		this._thead = document.createElement("thead");
		this._thead.obj = this;
		this._thead.control = this;
		base2.DOM.EventTarget(this._thead);
		this._table.appendChild(this._thead);

		this._theadRow = document.createElement("tr");
		this._theadRow.obj = this;
		this._theadRow.control = this;
		base2.DOM.EventTarget(this._theadRow);
		this._thead.appendChild(this._theadRow);

		if ((this._style & JSWT.CHECK) == JSWT.CHECK) {
			var checkboxCol = document.createElement("th");
			this._theadRow.appendChild(checkboxCol);
		}

		for (var i = 0, len = this._columnOrder.length; i < len; ++i) {
			this._columns[this._columnOrder[i]]._setParentNode(this._theadRow);
			this._columns[this._columnOrder[i]].update();
		}

		// table body
		this._tbody = document.createElement("tbody");
		this._tbody.obj = this;
		this._tbody.control = this;
		base2.DOM.EventTarget(this._tbody);
		this._table.appendChild(this._tbody);

		// listeners
		/* buffer unregistered user-defined listeners */
		var unregisteredListener = {};
		for (var eventType in this._listener) {
			unregisteredListener[eventType] = this._listener[eventType].concat([]);
		}

		/* Table event listener */
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

		// intial width calculation for TableColumns
		this._theadRow.style.width = this.domref.offsetWidth + "px";
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
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.TableItem)) {
			throw new TypeError("item is not type of gara.jswt.TableItem");
		}

		if (this._selection.contains(item)) {
			item._setSelected(false);
			this._selection.remove(item);
			this._shiftItem = item;
			this._activateItem(item);
			this._notifySelectionListener();
		}
	},

	deselectAll : function() {
		this.checkWidget();
		while (this._selection.length) {
			this.deselect(this._selection[0]);
		}
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
		this.domref.removeChild(this._scroller);

		if (this._parentNode != null) {
			this._parentNode.removeChild(this.domref);
		}

		delete this._theadRow;
		delete this._thead;
		delete this._tbody;
		delete this._table;
		delete this.domref;
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
	 * @return {gara.jswt.TreeItem} the item
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
	 * @return {gara.jswt.TreeItem[]}an array with items
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

	handleEvent : function(e) {
		this.checkWidget();
		var obj = e.target.obj || null;

		if (obj && $class.instanceOf(obj, gara.jswt.TableItem)) {
			e.item = obj;
		}
		e.widget = this;
		this._event = e;

		switch (e.type) {
			case "mousedown":
				if (!this._hasFocus) {
					this.forceFocus();
				}

				if ($class.instanceOf(obj, gara.jswt.TableItem)) {
					var item = obj;

					if (!e.ctrlKey && !e.shiftKey) {
						this.select(item, false);
					} else if (e.ctrlKey && e.shiftKey) {
						this._selectShift(item, true);
					} else if (e.shiftKey) {
						this._selectShift(item, false);
					} else if (e.ctrlKey) {
						if (this._selection.contains(item)) {
							this.deselect(item);
						} else {
							this.select(item, true);
						}
					} else {
						this.select(item);
					}
				}

				if ($class.instanceOf(obj, gara.jswt.TableColumn)) {
					obj.handleEvent(e);
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
				e.preventDefault();
				break;
		}

		if ($class.instanceOf(obj, gara.jswt.TableItem)) {
			this.handleContextMenu(e);
		}

		e.stopPropagation();

		/* in case of ie6, it is necessary to return false while the type of
		 * the event is "contextmenu" and the menu isn't hidden in ie6
		 */
		return false;
	},

	_handleKeyEvent : function(e) {
		this.checkWidget();
		if (this._activeItem == null) {
			return;
		}

		switch (e.keyCode) {
			case 38 : // up
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
						h += getItemHeight(this._items[i]);
					}
					var viewport = this._scroller.clientHeight + this._scroller.scrollTop
						- parseInt(gara.Utils.getStyle(this._scroller, "padding-top"))
						- parseInt(gara.Utils.getStyle(this._scroller, "padding-bottom"));
					var itemAddition = prev.domref.clientHeight
						- parseInt(gara.Utils.getStyle(prev.domref, "padding-top"))
						- parseInt(gara.Utils.getStyle(prev.domref, "padding-bottom"));

					this._scroller.scrollTop = h < this._scroller.scrollTop ? h : (viewport < h ? h - viewport + itemAddition : this._scroller.scrollTop);


					// handle select
					if (!e.ctrlKey && !e.shiftKey) {
						//this.deselect(this._activeItem);
						this.select(prev, false);
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
				var next = false;
				var activeIndex = this.indexOf(this._activeItem);

				if (activeIndex != this._items.length - 1) {
					next = this._items[activeIndex + 1];
				}

				if (next) {
					// update scrolling
					var h = 0;
					for (var i = 0; i <= (activeIndex + 1); i++) {
						h += getItemHeight(this._items[i]);
					}
					var min = h - getItemHeight(next);
					var viewport = this._scroller.clientHeight + this._scroller.scrollTop
						- parseInt(gara.Utils.getStyle(this._scroller, "padding-top"))
						- parseInt(gara.Utils.getStyle(this._scroller, "padding-bottom"));
					var scrollRange = h - this._scroller.clientHeight
						+ parseInt(gara.Utils.getStyle(this._scroller, "padding-top"))
						+ parseInt(gara.Utils.getStyle(this._scroller, "padding-bottom"));

					this._scroller.scrollTop = h > viewport ? (scrollRange < 0 ? 0 : scrollRange) : (this._scroller.scrollTop > min ? min : this._scroller.scrollTop);


					// handle select
					if (!e.ctrlKey && !e.shiftKey) {
						this.select(next, false);
					} else if (e.ctrlKey && e.shiftKey) {
						this._selectShift(next, true);
					} else if (e.shiftKey) {
						this._selectShift(next, false);
					} else if (e.ctrlKey) {
						this._activateItem(next);
					}
				}
				break;

			case 32 : // space
				if (this._selection.contains(this._activeItem) && e.ctrlKey) {
					this.deselect(this._activeItem);
				} else {
					this.select(this._activeItem, true);
				}
				break;

			case 36 : // home
				this._scroller.scrollTop = 0;

				if (!e.ctrlKey && !e.shiftKey) {
					this.select(this._items[0], false);
				} else if (e.shiftKey) {
					this._selectShift(this._items[0], false);
				} else if (e.ctrlKey) {
					this._activateItem(this._items[0]);
				}
				break;

			case 35 : // end
				this._scroller.scrollTop = this._scroller.scrollHeight - this._scroller.clientHeight;

				var lastOffset = this._items.length - 1;
				if (!e.ctrlKey && !e.shiftKey) {
					this.select(this._items[lastOffset], false);
				} else if (e.shiftKey) {
					this._selectShift(this._items[lastOffset], false);
				} else if (e.ctrlKey) {
					this._activateItem(this._items[lastOffset]);
				}
				break;
		}

		function getItemHeight(item) {
			return item.domref.offsetHeight
				+ parseInt(gara.Utils.getStyle(item.domref, "margin-top"))
				+ parseInt(gara.Utils.getStyle(item.domref, "margin-bottom"));
		}
	},

	/**
	 * @method
	 * Looks for the index of a specified item
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.TableItem} item the item for the index
	 * @throws {gara.jswt.ItemNotExistsException} if the item does not exist in this table
	 * @throws {TypeError} if the item is not a TableItem
	 * @return {int} the index of the specified item
	 */
	indexOf : function(item) {
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.TableItem)) {
			throw new TypeError("item not instance of gara.jswt.TableItem");
		}

		if (!this._items.contains(item)) {
			throw new gara.jswt.ItemNotExistsException("item [" + item + "] does not exists in this list");
		}

		return this._items.indexOf(item);
	},

	isScrollbarVisible : function() {
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
		if (this._table) {
			gara.EventManager.addListener(this._table, eventType, listener);
		}
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
	 * Removes items whose indices are passed by an array
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
	 * Removes all items from the table
	 *
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	removeAll : function() {
		this.checkWidget();
		while (this._items.length) {
			var item = this._items.pop();
			this._table.removeChild(item.domref);
			delete item;
		}
	},

	/**
	 * @method
	 * Removes a selection listener from this table
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.SelectionListener} listener the listener to be removed from this table
	 * @throws {TypeError} if the listener is not a SelectionListener
	 * @return {void}
	 */
	removeSelectionListener : function(listener) {
		if (!$class.instanceOf(listener, gara.jswt.SelectionListener)) {
			throw new TypeError("listener is not type of gara.jswt.SelectionListener");
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
	 * @param {gara.jswt.TableItem} item the item that should be selected
	 * @throws {TypeError} if the item is not a TableItem
	 * @return {void}
	 */
	select : function(item, _add) {
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.TableItem)) {
			throw new TypeError("item not instance of gara.jswt.TableItem");
		}

		if (!_add || (this._style & JSWT.MULTI) != JSWT.MULTI) {
			while (this._selection.length) {
				var i = this._selection.pop();
				i._setSelected(false);
				i.update();
			}
		}

		if (!this._selection.contains(item)) {
			this._selection.push(item);
			item._setSelected(true);
			this._shiftItem = item;
			this._activateItem(item);
			this._notifySelectionListener();
		}
	},

	/**
	 * @method
	 * Selects a Range of items. From shiftItem to the passed item.
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.TableItem} item the item
	 * @return {void}
	 */
	_selectShift : function(item, _add) {
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.TableItem)) {
			throw new TypeError("item is not type of gara.jswt.TableItem");
		}

		if (!_add) {
			while (this._selection.length) {
				var i = this._selection.pop();
				i._setSelected(false);
				i.update();
			}
		}

		if ((this._style & JSWT.MULTI) == JSWT.MULTI) {
			var indexShift = this.indexOf(this._shiftItem);
			var indexItem = this.indexOf(item);
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
			this.select(item);
		}
	},

	/**
	 * @method
	 * Sets the selection of the tree
	 *
	 * @author Thomas Gossmann
	 * @param {Array} items the array with the <code>TableItem</code> items
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

	setColumnOrder : function(order) {
		this._columnOrder = order;
	},

	setHeaderVisible : function(show) {
		this._headerVisible = show;
	},

	setLinesVisible : function(show) {
		this._linesVisible = show;
	},

	toString : function() {
		return "[gara.jswt.Table]";
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
		if (this._table != null) {
			gara.EventManager.removeListener(this._table, eventType, listener);
		}
	},

	update : function() {
		this.checkWidget();
		if (this._table == null) {
			this._create();
		}


		// update table head
		if (this._headerVisible) {
			this._thead.style.display = document.all ? "block" : "table-row-group";
		} else {
			this._thead.style.display = "none";
		}
		this._thead.style.position = "static";

		while (this._theadRow.childNodes.length) {
			this._theadRow.removeChild(this._theadRow.childNodes[0]);
		}

		if ((this._style & JSWT.CHECK) == JSWT.CHECK) {
			if (this._checkboxCol == null) {
				this._checkboxCol = document.createElement("th");
				this._checkboxCol.innerHTML = "&nbsp;"; // for IE6
				this._checkboxCol.className = "jsWTTableCheckboxCol";
			}
			this._theadRow.appendChild(this._checkboxCol);
		} else if (this._checkboxCol != null) {
			this._theadRow.removeChild(this._checkboxCol);
		}

		for (var i = 0, len = this._columnOrder.length; i < len; ++i) {
			var col = this._columns[this._columnOrder[i]];
			col.update();
			this._theadRow.appendChild(col.domref);
		}

		for (var i = 0, len = this._columnOrder.length; i < len; ++i) {
			var col = this._columns[this._columnOrder[i]];
			col.setWidth(col.getWidth());
			col.update();
		}


		// set table class names
		this._tbody.className = "";
		this.removeClassName("jsWTTableNoLines");
		this.removeClassName("jsWTTableLines");
		this.addClassName("jsWTTable" + (this._linesVisible ? "" : "No") + "Lines");

		if ((this._style & JSWT.FULL_SELECTION) == JSWT.FULL_SELECTION) {
			this._tbody.className = "jsWTTableFullSelection";
		}

		this.domref.className = this._className;


		// update items
		this._items.forEach(function(item, index, arr) {
			item._setParentNode(this._tbody);
			item.update();
		}, this);


		// reset measurement for new calculations
		this._thead.style.position = "absolute";

		if (this._width != null) {
			this.domref.style.width = this._width + "px";
			this._thead.style.width = this._width + "px";
		}

		this.domref.style.height = this._height != null ? (this._height - this._thead.offsetHeight) + "px" : "";
		this.domref.style.paddingTop = this._thead.offsetHeight + "px";
		this._scroller.style.height = this._height != null ? (this._height - this._thead.offsetHeight) + "px" : "auto";


		// adjustments based on measurements
		if (this._items.length) {
			this._items[0]._adjustWidth();
		}

	}
});