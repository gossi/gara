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
 * gara TableColumn
 *
 * @class TableColumn
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @extends gara.jswt.Item
 */
$class("TableColumn", {
	$extends : gara.jswt.Item,

	$constructor : function(parent, style, index) {

		if (!$class.instanceOf(parent, gara.jswt.Table)) {
			throw new TypeError("parent is not a gara.jswt.Table");
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
		this.domref = document.createElement("th");
		this.domref.obj = this;
		this.domref.control = this._table;

		if (this._image != null) {
			this._img = document.createElement("img");
			this._img.obj = this;
			this._img.control = this._table;
			this._img.src = this._image.src;
			base2.DOM.EventTarget(this._img);

			this.domref.appendChild(this._img);
		}

		this._operator = document.createElement("span");
		this._operator.className = "mover";
		this._operator.obj = this;
		this._operator.control = this._table;
		this.domref.appendChild(this._operator);

		this._span = document.createElement("span");
		this._span.obj = this;
		this._span.control = this._table;
		this._span.className = "text";
		this._spanText = document.createTextNode(this._text);
		this._span.appendChild(this._spanText);
		this.domref.appendChild(this._span);

		base2.DOM.EventTarget(this.domref);
		base2.DOM.EventTarget(this._operator);
		base2.DOM.EventTarget(this._span);

		if (this._parentNode != null) {
			this._parentNode.appendChild(this.domref);
		}
	},

	_computeWidth : function() {
		this.checkWidget();
		if (this.domref != null && this.domref.style.display != "none") {
			this._width = this.domref.offsetWidth;
			this._width = this._width == 0 ? null : this._width;
		}
	},

	dispose : function() {
		this.$base();

		if (this._img != null) {
			this.domref.removeChild(this._img);
			delete this._img;
			delete this._image;
		}
		this.domref.removeChild(this._operator);
		this.domref.removeChild(this._span);

		if (this._parentNode != null) {
			this._parentNode.removeChild(this.domref);
		}

		delete this._operator;
		delete this._span;
		delete this.domref;
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
				&& this._parent.isScrollbarVisible()) {
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
					if (this._parent.isScrollbarVisible()) {
						if (this.nextColumn == columns[order[order.length - 1]]) {
							this.nextStartWidth += 19;
						}
						this.allColsWidth += 19;
					}

					gara.EventManager.addListener(document, "mousemove", this);
					gara.EventManager.addListener(document, "mouseup", this);
				}

				// Moving Column
				if (e.target == this.domref && this._moveable) {
					this._isMoving = true;

					var shadowWidth = null;
					var order = this._table.getColumns();
					var offset = order.indexOf(this);

					this._shadow = new gara.jswt.Table(document.getElementsByTagName("body")[0], this._table.getStyle() &~ JSWT.CHECK);
					this._shadow.setHeaderVisible(this._table.getHeaderVisible());

					this._table.getColumns().forEach(function(col, index, arr) {
						if (index == offset) {
							var c = new gara.jswt.TableColumn(this._shadow);
							shadowWidth = col.getWidth();
							c.setText(col.getText());
							c.setWidth(shadowWidth);
						}
					}, this);

					this._table.getItems().forEach(function(item, index, arr) {
						var i = new gara.jswt.TableItem(this._shadow);
						i.setText(item.getText(offset));
						i.setImage(item.getImage(offset));
					}, this);

					this._shadow.update();
					this._shadow.domref.style.position = "absolute";
					this._shadow.domref.style.left = e.clientX + 16 + "px";
					this._shadow.domref.style.top = e.clientY + 16 + "px";
					this._shadow.domref.style.opacity = "0.3";
					this._shadow.domref.style.width = shadowWidth + "px";

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
						this.domref.style.width = this._width + "px";
						this.nextColumn.domref.style.width = nextWidth + "px";
						this.nextColumn.setWidth(nextWidth);
						this._parent.getItems()[0]._adjustWidth();
					}
				}

				// Moving
				if (this._isMoving) {
					this._shadow.domref.style.left = e.clientX + 16 + "px";
					this._shadow.domref.style.top = e.clientY + 16 + "px";
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

					if (e.target.obj && $class.instanceOf(e.target.obj, gara.jswt.TableColumn)
						&& e.target.obj.getParent() == this._table) {
						var col = e.target.obj;
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

	setWidth : function(width) {
		this.checkWidget();
		this._width = width;
	},

	toString : function() {
		return "[gara.jswt.TableColumn]";
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
	},

	update : function() {
		this.checkWidget();
		if (this.domref == null) {
			this._create();
		}

		if (this.hasChanged()) {
			// create image
			if (this._image != null && this._img == null) {
				this._img = document.createElement("img");
				this._img.obj = this;
				this._img.control = this._table;
				this._img.src = this._image.src;
				this.domref.insertBefore(this._img, this._operator);
				base2.DOM.EventTarget(this._img);
			}

			// update image information
			else if (this._image != null) {
				this._img.src = this._image.src;
			}

			// delete image
			else if (this._img != null && this._image == null) {
				this.domref.removeChild(this._img);
				this._img = null;
			}

			this._spanText.nodeValue = this._text;
		}

		this.removeClassName("operator");

		var columnOrder = this._table.getColumnOrder();
		if (this._table.getColumns()[columnOrder[columnOrder.length - 1]] != this) {
			this.addClassName("operator");
		}

		this.domref.className = this._className;

		if (!isNaN(this._width) && this._width != null) {
			this.domref.style.width = this._width + "px";
		}

		this.releaseChange();
	}
});