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

gara.provide("gara.jswt.widgets.TableColumn");

gara.use("gara.EventManager");
gara.use("gara.jswt.JSWT");
gara.use("gara.jswt.widgets.TableItem");

gara.require("gara.jswt.widgets.Item");
gara.require("gara.jswt.widgets.Table");

/**
 * gara TableColumn
 *
 * @class TableColumn
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @extends gara.jswt.widgets.Item
 */
gara.Class("gara.jswt.widgets.TableColumn", {
	$extends : gara.jswt.widgets.Item,

	$constructor : function(parent, style, index) {

		if (!gara.instanceOf(parent, gara.jswt.widgets.Table)) {
			throw new TypeError("parent is not a gara.jswt.widgets.Table");
		}

		this.$base(parent, style);

		this._table = parent;
		this._table._addColumn(this, index);
		this._shadow = null;

		this._width = null;
		this._img = null;
		this._span = null;
		this._spanText = null
		this._operator = null;

		this._moveable = true;
		this._resizable = true;

		this._isMoving = false;
		this._isResizing = false;
	},

	_create : function() {
		this.handle = document.createElement("th");
		this.handle.id = this.getId();
		this.handle.widget = this;
		this.handle.control = this._table;

		base2.DOM.Event(this.handle);
		this.handle.setAttribute("role", "columnheader");
		this.handle.setAttribute("aria-labelledby", this.getId() + "-label");


		// create image node
		this._img = document.createElement("img");
		this._img.id = this.getId() + "-image";
		this._img.widget = this;
		this._img.control = this._tree;

		base2.DOM.Event(this._img);
		this._img.setAttribute("role", "presentation");

		// set image
		if (this._image != null) {
			this._img.src = this._image.src;
		} else {
			this._img.style.display = "none";
		}

		// operator node
		this._operator = document.createElement("span");
		this._operator.className = "mover";
		this._operator.id = this.getId() + "-operator";
		this._operator.widget = this;
		this._operator.control = this._table;
		base2.DOM.Event(this._operator);
		this._operator.setAttribute("role", "presentation");

		// text node
		this._span = document.createElement("span");
		this._span.id = this.getId() + "-label";
		this._span.widget = this;
		this._span.control = this._table;
		this._span.className = "text";
		this._spanText = document.createTextNode(this._text);
		this._span.appendChild(this._spanText);
		base2.DOM.Event(this._span);
		this._span.setAttribute("role", "presentation");

		// add nodes
		this.handle.appendChild(this._img);
		this.handle.appendChild(this._operator);
		this.handle.appendChild(this._span);

		if (this._parentNode != null) {
			this._parentNode.appendChild(this.handle);
		}
	},

	_computeWidth : function() {
		this.checkWidget();
		if (this.handle != null && this.handle.style.display != "none") {
			this._width = this.handle.offsetWidth;
			this._width = this._width == 0 ? null : this._width;
		}
	},

	dispose : function() {
		this.$base();

		if (this._img != null) {
			this.handle.removeChild(this._img);
			delete this._img;
			delete this._image;
		}
		this.handle.removeChild(this._operator);
		this.handle.removeChild(this._span);

		if (this._parentNode != null) {
			this._parentNode.removeChild(this.handle);
		}

		delete this._operator;
		delete this._span;
		delete this.handle;
	},

	getWidth : function() {
		this.checkWidget();
		if (this._width == null || this._width == "auto") {
			this._computeWidth();
		}

		// if last Column and Scrollbar is visible
		var columns = this._parent.getColumns();
		var columnOrder = this._parent.getColumnOrder();
		if (columns[columnOrder[columnOrder.length - 1]] == this
				&& this._parent.getVerticalScrollbar()) {
			return this._width - 19;
		}

		return this._width;
	},

	handleEvent : function(e) {
		this.checkWidget();
		switch(e.type) {
			case "mousedown":
				// Resizing Column
				if (e.target == this._operator && this._resizable) {
					this._isResizing = true;

					this.allColsWidth = 0;
					var columns = this._table.getColumns();
					columns.forEach(function(item, index, arr) {
						var width = item.getWidth();
						this.allColsWidth += width;
					}, this);

					var order = this._table.getColumnOrder();
					var thisColumnIndex = columns.indexOf(this);
					var thisColumnOrder = order.indexOf(thisColumnIndex);
					this.nextColumn = columns[order[thisColumnOrder + 1]];
					this.lessColsWidth = this.allColsWidth - this.getWidth() - this.nextColumn.getWidth();

					this.resizeStart = e.clientX;
					this.startWidth = this._width;
					this.nextStartWidth = this.nextColumn.getWidth();
					if (this._parent.getVerticalScrollbar()) {
						if (this.nextColumn == columns[order[order.length - 1]]) {
							this.nextStartWidth += 19;
						}
						this.allColsWidth += 19;
					}

					gara.EventManager.addListener(document, "mousemove", this);
					gara.EventManager.addListener(document, "mouseup", this);
				}

				// Moving Column
				if (e.target == this.handle && this._moveable) {
					this._isMoving = true;

					var order = this._table.getColumns();
					var offset = order.indexOf(this);

					this._shadow = new gara.jswt.widgets.Table(document.getElementsByTagName("body")[0], this._table.getStyle() &~ gara.jswt.JSWT.CHECK);
					this._shadow.setHeaderVisible(this._table.getHeaderVisible());
					this._shadow.setHeight(this._table.getHeight());
					this._shadow.addClass("jsWTTableShadow");

					this._table.getColumns().forEach(function(col, index, arr) {
						if (index == offset) {
							var c = new gara.jswt.widgets.TableColumn(this._shadow);
							c.setText(col.getText());
							c.setWidth(col.getWidth()+(offset == order.length -1 ? 38 : 19));
						}
					}, this);

					this._table.getItems().forEach(function(item) {
						var i = new gara.jswt.widgets.TableItem(this._shadow);
						i.setText(item.getText(offset));
						i.setImage(item.getImage(offset));
					}, this);

					this._shadow.update();
					this._shadow.handle.style.position = "absolute";
					this._shadow.handle.style.left = e.clientX + 16 + "px";
					this._shadow.handle.style.top = e.clientY + 16 + "px";
					this._shadow.handle.style.opacity = "0.3";

					gara.EventManager.addListener(document, "mousemove", this);
					gara.EventManager.addListener(document, "mouseup", this);
				}
				break;

			case "mousemove":
				// Resizing
				if (this._isResizing) {
					var minWidth = 20;

					var delta = e.clientX - this.resizeStart;
					var width = this.startWidth + delta;
					var nextWidth = this.nextStartWidth - delta;

					if (width > minWidth && nextWidth > minWidth) {
						this._width = width;
						this.handle.style.width = this._width + "px";
						this.nextColumn.handle.style.width = nextWidth + "px";
						this.nextColumn.setWidth(nextWidth);
						this._parent.getItems()[0]._adjustWidth();
					}
				}

				// Moving
				if (this._isMoving) {
					this._shadow.handle.style.left = e.clientX + 16 + "px";
					this._shadow.handle.style.top = e.clientY + 16 + "px";
				}
				break;

			case "mouseup":
				// Resizing
				if (this._isResizing) {
					gara.EventManager.removeListener(document, "mousemove", this);
					gara.EventManager.removeListener(document, "mouseup", this);
					this._isResizing = false;
				}

				// Moving
				if (this._isMoving) {
					gara.EventManager.removeListener(document, "mousemove", this);
					gara.EventManager.removeListener(document, "mouseup", this);
					this._isMoving = false;
					this._shadow.dispose();

					delete this._shadow;

					this._shadow = null;

					if (e.target.widget && gara.instanceOf(e.target.widget, gara.jswt.widgets.TableColumn)
						&& e.target.widget.getParent() == this._table) {
						var col = e.target.widget; // drag
						var colOrder = this._table.getColumnOrder();
						var colIndex = this._table.getColumns().indexOf(col);
						var orderIndex = colOrder.indexOf(colIndex);
						var thisColIndex = this._table.getColumns().indexOf(this);
						colOrder.remove(thisColIndex);
						colOrder.insertAt(orderIndex, thisColIndex);
						this._table.update();
					}
				}
				break;
		}
	},

	_registerListener : function() {},

	setImage : function(image) {
		this.$base(image);

		if (this.handle) {
			// update image
			if (this._image != null) {
				this._img.src = this._image.src;
				this._img.style.display = "";
			}

			// hide image
			else {
				this._img.src = "";
				this._img.style.display = "none";
			}
		}
		return this;
	},

	setText : function(text) {
		this.$base(text);
		if (this.handle) {
			this._spanText.nodeValue = this._text;
		}
		return this;
	},

	setWidth : function(width) {
		this.checkWidget();
		this._width = width;

		if (this.handle) {
			this.handle.style.width = this._width + "px";
		}

		return this;
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
	},

	update : function() {
		this.checkWidget();
		if (this.handle == null) {
			this._create();
		}

		var columnOrder = this._table.getColumnOrder();
		this.setClass("operator", this._table.getColumns()[columnOrder[columnOrder.length - 1]] != this);

//		if (!isNaN(this._width) && this._width != null) {
//			this.handle.style.width = this._width + "px";
//		}
	}
});