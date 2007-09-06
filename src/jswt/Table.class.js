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
 * @extends Composite
 */
$class("Table", {
	$extends : gara.jswt.Composite,

	/**
	 * @method
	 * 
	 * @private
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
		this._thead = null;
		this._theadRow = null;
		this._tbody = null;

		this._className = this._baseClass = "jsWTTable";
		
		this._selection = [];
		this._shiftItem = null;
		this._activeItem = null;
	},
	
	_activateItem : function(item) {
		if (!$class.instanceOf(item, gara.jswt.TableItem)) {
			throw new TypeError("item is not type of gara.jswt.TableItem");
		}
		// set a previous active item inactive
		if (this._activeItem != null) {
			this._activeItem.setActive(false);
		}

		this._activeItem = item;
		this._activeItem.setActive(true);
		this.update();
	},

	_addItem : function(item) {
		if (!$class.instanceOf(item, gara.jswt.TableItem)) {
			throw new TypeError("item is not a gara.jswt.TableItem");
		}

		this._items.push(item);
	},

	_addColumn : function(column) {
		if (!$class.instanceOf(column, gara.jswt.TableColumn)) {
			throw new TypeError("column is not a gara.jswt.TableColumn");
		}

		this._columns.push(column);
		this._columnOrder.push(this._columns.length - 1);
	},

	_create : function() {
		this.domref = document.createElement("table");
		this.domref.obj = this;
		this.domref.control = this;
		base2.DOM.EventTarget(this.domref);

		if (this._headerVisible) {
			this._createTableHead();
		}

		this._tbody = document.createElement("tbody");
		this._tbody.obj = this;
		this._tbody.control = this;
		base2.DOM.EventTarget(this._tbody);
		this.domref.appendChild(this._tbody);
		
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
				this.registerListener(eventType, elem);
			}, this);
		}

		/* If parent is not a composite then it *must* be a HTMLElement
		 * but because of IE there is no cross-browser check. Or no one I know of.
		 */
		if (!$class.instanceOf(this._parent, gara.jswt.Composite)) {
			this._parent.appendChild(this.domref);
		}
	},

	_createTableHead : function() {
		this._thead = document.createElement("thead");
		this._thead.obj = this;
		this._thead.control = this;
		base2.DOM.EventTarget(this._thead);
		this.domref.appendChild(this._thead);

		this._theadRow = document.createElement("tr");
		this._theadRow.obj = this;
		this._theadRow.control = this;
		base2.DOM.EventTarget(this._theadRow);
		this._thead.appendChild(this._theadRow);

		for (var i = 0, len = this._columnOrder.length; i < len; ++i) {
			this._columns[i].update();
			this._theadRow.appendChild(this._columns[i].domref);
		}
	},
	
	/**
	 * @method
	 * Deselects a specific item
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.TreeItem} item the item to deselect
	 * @returns {void}
	 */
	deselect : function(item) {
		if (!$class.instanceOf(item, gara.jswt.TableItem)) {
			throw new TypeError("item is not type of gara.jswt.TableItem");
		}
	
		if (this._selection.contains(item)) {
			this._selection.remove(item);
			this._notifySelectionListener();
			item.setSelected(false);
			this._shiftItem = item;
			this._activateItem(item);
		}
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

	getLinesVisible : function() {
		return this._linesVisible;
	},

	handleEvent : function(e) {
		var obj = e.target.obj || null;
		
//		console.log("List.handleEvent(" + e.type + ")");
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
			
				this._items.forEach(function(item, index, arr) {
					item.handleEvent(e);
				});

				this._notifyExternalKeyboardListener(e, this, this);
				
				if (e.type == "keydown") {
					this._handleKeyEvent(e);					
				}
				break;
		}

		e.stopPropagation();
	},
	
	_handleKeyEvent : function(e) {
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
				if (!e.ctrlKey && !e.shiftKey) {
					this.select(this._items[0], false);
				} else if (e.shiftKey) {
					this._selectShift(this._items[0], false);
				} else if (e.ctrlKey) {
					this._activateItem(this._items[0]);
				}
				break;
				
			case 35 : // end
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
	},
	
	/**
	 * @method
	 * Looks for the index of a specified item
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.TableItem} item the item for the index
	 * @throws {gara.jswt.ItemNotExistsException} if the item does not exist in this table
	 * @throws {TypeError} if the item is not a TableItem
	 * @returns {int} the index of the specified item
	 */
	indexOf : function(item) {
		if (!$class.instanceOf(item, gara.jswt.TableItem)) {
			throw new TypeError("item not instance of gara.jswt.TableItem");
		}

		if (!this._items.contains(item)) {
			throw new gara.jswt.ItemNotExistsException("item [" + item + "] does not exists in this list");
		}

		return this._items.indexOf(item);
	},
	
	_notifySelectionListener : function() {
		
	},

	registerListener : function(eventType, listener) {
		if (this.domref) {
			gara.EventManager.getInstance().addListener(this.domref, eventType, listener);
		}
	},
	
	/**
	 * @method
	 * Selects an item
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.TableItem} item the item that should be selected
	 * @throws {TypeError} if the item is not a TableItem
	 * @returns {void}
	 */
	select : function(item, _add) {
		if (!$class.instanceOf(item, gara.jswt.TableItem)) {
			throw new TypeError("item not instance of gara.jswt.TableItem");
		}

		if (!_add || (this._style & JSWT.MULTI) != JSWT.MULTI) {
			while (this._selection.length) {
				this._selection.pop().setSelected(false);
			}
		}

		if (!this._selection.contains(item)) {
			this._selection.push(item);
			item.setSelected(true);
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
	 * @returns {void}
	 */
	_selectShift : function(item, _add) {
		if (!$class.instanceOf(item, gara.jswt.TableItem)) {
			throw new TypeError("item is not type of gara.jswt.TableItem");
		}

		if (!_add) {
			while (this._selection.length) {
				this._selection.pop().setSelected(false);
			}
		}

		if ((this._style & JSWT.MULTI) == JSWT.MULTI) {
			var indexShift = this.indexOf(this._shiftItem);
			var indexItem = this.indexOf(item);
			var from = indexShift > indexItem ? indexItem : indexShift;
			var to = indexShift < indexItem ? indexItem : indexShift;

			for (var i = from; i <= to; ++i) {
				this._selection.push(this._items[i]);
				this._items[i].setSelected(true);
			}

			this._activateItem(item);			
			this._notifySelectionListener();
		} else {
			this.select(item);
		}
	},

	setHeaderVisible : function(show) {
		this._headerVisible = show;
	},
	
	setLinesVisible : function(show) {
		this._linesVisible = show;
	},

	update : function() {
		if (this.domref == null) {
			this._create();
		} else {
			// update table head
			while (this._theadRow.childNodes.length) {
				this._theadRow.removeChild(this._theadRow.childNodes[0]);
			}
			for (var i = 0, len = this._columnOrder.length; i < len; ++i) {
				this._columns[i].update();
				this._theadRow.appendChild(this._columns[i].domref);
			}
		}

		this.removeClassName("jsWTTableNoLines");
		this.removeClassName("jsWTTableLines");
		this.removeClassName("jsWTTableFullSelection");	

		if (this._linesVisible) {
			this.addClassName("jsWTTableLines");
		} else {
			this.addClassName("jsWTTableNoLines");
		}

		if ((this._style & JSWT.FULL_SELECTION) == JSWT.FULL_SELECTION) {
			this.addClassName("jsWTTableFullSelection");
		}

		this.domref.className = this._className;

		// update items
		this._updateItems();
	},
	
	_updateItems : function() {
		this._items.forEach(function(item, index, arr) {
			// create item ...
			if (!item.isCreated()) {
				item._create();
				this._tbody.appendChild(item.domref);
			}

			// ... or update it
			if (item.hasChanged()) {
				item.update();
				item.releaseChange();
			}
		}, this);
	}
});