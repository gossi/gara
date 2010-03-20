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

gara.provide("gara.jswt.widgets.TableColumn");

gara.use("gara.EventManager");
gara.use("gara.jswt.JSWT");
gara.use("gara.jswt.widgets.TableItem");
//gara.use("gara.jswt.widgets.Table");

gara.require("gara.jswt.widgets.Item");


/**
 * gara TableColumn
 *
 * @class TableColumn
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @extends gara.jswt.widgets.Item
 */
gara.ready(function() {gara.Class("gara.jswt.widgets.TableColumn", {
	$extends : gara.jswt.widgets.Item,

	/**
	 * @field
	 * Contains a shadow copy of the <code>Table</code> that is used, when
	 * moving columns.
	 *
	 * @private
	 * @type {gara.jswt.widgets.Table}
	 */
	shadow : null,

	/**
	 * @field
	 * Width of this column.
	 *
	 * @private
	 * @type {int}
	 */
	width : 0,

	/**
	 * @field
	 * Image's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	img : null,

	/**
	 * @field
	 * Text's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	span : null,

	/**
	 * @field
	 * Text's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	spanText : null,

	/**
	 * @field
	 * Operator's DOM reference.
	 *
	 * @private
	 * @type {}
	 */
	operator : null,


	/**
	 * @field
	 * Holds the moveable flag.
	 *
	 * @private
	 * @type {boolean}
	 */
	moveable : true,

	/**
	 * @field
	 * Holds the resizable flag.
	 *
	 * @private
	 * @type {boolean}
	 */
	resizable : true,


	/**
	 * @field
	 * Holds the flag wether this column is currently being moved.
	 *
	 * @private
	 * @type {boolean}
	 */
	isMoving : false,

	/**
	 * @field
	 * Holds the flag wether this column is currently being resized.
	 *
	 * @private
	 * @type {boolean}
	 */
	isResizing : false,

	$constructor : function (parent, style, index) {

		if (!(parent instanceof gara.jswt.widgets.Table)) {
			throw new TypeError("parent is not a gara.jswt.widgets.Table");
		}

		this.$super(parent, style);

		this.parentNode = this.parent.addColumn(this, index);
		this.shadow = null;

		this.width = null;
		this.img = null;
		this.span = null;
		this.spanText = null;
		this.operator = null;

		this.moveable = true;
		this.resizable = true;

		this.isMoving = false;
		this.isResizing = false;
		this.createWidget();
	},

	/**
	 * @method
	 *
	 * @private
	 */
	bindListener : function () {},

	createWidget : function () {
		var thead, cols, colsWidth, i, width, parentWidth;
		this.handle = document.createElement("th");
		this.handle.id = this.getId();
		this.handle.widget = this;
		this.handle.control = this.parent;
		this.handle.setAttribute("role", "columnheader");
		this.handle.setAttribute("aria-labelledby", this.getId() + "-label");
		this.handle.setAttribute("unselectable", "on");

		// create image node
		this.img = document.createElement("img");
		this.img.id = this.getId() + "-image";
		this.img.widget = this;
		this.img.control = this.tree;
		this.img.setAttribute("role", "presentation");
		this.img.setAttribute("unselectable", "on");

		// set image
		if (this.image !== null) {
			this.img.src = this.image.src;
		} else {
			this.img.style.display = "none";
		}

		// operator node
		this.operator = document.createElement("span");
		this.operator.className = "mover";
		this.operator.id = this.getId() + "-operator";
		this.operator.widget = this;
		this.operator.control = this.parent;
		this.operator.setAttribute("role", "presentation");
		this.operator.setAttribute("unselectable", "on");

		// text node
		this.span = document.createElement("span");
		this.span.id = this.getId() + "-label";
		this.span.widget = this;
		this.span.control = this.parent;
		this.span.className = "text";
		this.spanText = document.createTextNode(this.text);
		this.span.appendChild(this.spanText);
		this.span.setAttribute("role", "presentation");
		this.span.setAttribute("unselectable", "on");

		// add nodes
		this.handle.appendChild(this.img);
		this.handle.appendChild(this.operator);
		this.handle.appendChild(this.span);

		if (this.parentNode !== null) {
			thead = this.parentNode.parentNode;
			thead.style.position = "relative";
			this.parentNode.appendChild(this.handle);
			cols = this.parent.getColumns();
			colsWidth = 0;
			parentWidth = this.parentNode.clientWidth;
			for (i = 0, len = cols.length; i < len - 1; ++i) {
				width = Math.floor(parentWidth / len);
				colsWidth += width;
				cols[i].setWidth(width);
				cols[i].setClass("operator", true);
			}
			this.setWidth(parentWidth - colsWidth);
			thead.style.position = "absolute";
		}

		this.parent.updateMeasurements();
	},

	/**
	 * @method
	 *
	 * @private
	 */
	computeWidth : function () {
		this.checkWidget();
		if (this.handle !== null && this.handle.style.display !== "none") {
			this.width = this.handle.offsetWidth;
			this.width = this.width === 0 ? null : this.width;
		}
	},

	dispose : function () {
		this.$super();

		if (this.img !== null) {
			this.handle.removeChild(this.img);
			delete this.img;
			delete this.image;
		}
		this.handle.removeChild(this.operator);
		this.handle.removeChild(this.span);

		if (this.parentNode !== null) {
			this.parentNode.removeChild(this.handle);
		}

		delete this.operator;
		delete this.span;
		delete this.handle;
	},

	getWidth : function () {
		var columns, columnOrder;
		this.checkWidget();
		if (this.width === null || this.width === "auto") {
			this.computeWidth();
		}

		// if last Column and Scrollbar is visible
		columns = this.parent.getColumns();
		columnOrder = this.parent.getColumnOrder();
		if (columns[columnOrder[columnOrder.length - 1]] === this
				&& this.parent.getVerticalScrollbar()) {
			return this.width - gara.jswt.JSWT.SCROLLBAR_WIDTH;
		}

		return this.width;
	},

	handleEvent : function (e) {
		var order, thisColumnIndex, thisColumnOrder, columns, offset,
			minWidth, delta, nextWidth, width,
			col, colOrder, colIndex, orderIndex, thisColIndex;
		this.checkWidget();
		switch(e.type) {
		case "mousedown":
			// Resizing Column
			if (e.target === this.operator && this.resizable) {
				this.isResizing = true;

				this.allColsWidth = 0;
				columns = this.parent.getColumns();
				columns.forEach(function (item, index, arr) {
					this.allColsWidth += item.getWidth();
				}, this);

				order = this.parent.getColumnOrder();
				thisColumnIndex = columns.indexOf(this);
				thisColumnOrder = order.indexOf(thisColumnIndex);
				this.nextColumn = columns[order[thisColumnOrder + 1]];
				this.lessColsWidth = this.allColsWidth - this.getWidth() - this.nextColumn.getWidth();

				this.resizeStart = e.clientX;
				this.startWidth = this.width;
				this.nextStartWidth = this.nextColumn.getWidth();
				if (this.parent.getVerticalScrollbar()) {
					if (this.nextColumn === columns[order[order.length - 1]]) {
						this.nextStartWidth += gara.jswt.JSWT.SCROLLBAR_WIDTH;
					}
					this.allColsWidth += gara.jswt.JSWT.SCROLLBAR_WIDTH;
				}

				gara.EventManager.addListener(document, "mousemove", this);
				gara.EventManager.addListener(document, "mouseup", this);
			}

			// Moving Column
			if (e.target === this.handle && this.moveable) {
				this.isMoving = true;

				order = this.parent.getColumns();
				offset = order.indexOf(this);

				this.shadow = new gara.jswt.widgets.Table(document.getElementsByTagName("body")[0], this.parent.getStyle() &~ gara.jswt.JSWT.CHECK);
				this.shadow.setHeaderVisible(this.parent.getHeaderVisible());
				this.shadow.setLinesVisible(this.parent.getLinesVisible());
				this.shadow.setHeight(this.parent.getHeight());
				this.shadow.addClass("jsWTTableShadow");

				this.parent.getColumns().forEach(function (col, index, arr) {
					var c;
					if (index === offset) {
						c = new gara.jswt.widgets.TableColumn(this.shadow);
						c.setText(col.getText());
						c.setWidth(col.getWidth()+(offset === order.length -1 ? gara.jswt.JSWT.SCROLLBAR_WIDTH * 2 : gara.jswt.JSWT.SCROLLBAR_WIDTH));
					}
				}, this);

				this.parent.getItems().forEach(function (item) {
					var i = new gara.jswt.widgets.TableItem(this.shadow);
					i.setText(item.getText(offset));
					i.setImage(item.getImage(offset));
				}, this);

//					this.shadow.update();
				if (!e.pageX){e.pageX = e.clientX + document.documentElement.scrollLeft;}
				if (!e.pageY){e.pageY = e.clientY + document.documentElement.scrollTop;}
				this.shadow.handle.style.left = e.pageX + 16 + "px";
				this.shadow.handle.style.top = e.pageY + 16 + "px";

				gara.EventManager.addListener(document, "mousemove", this);
				gara.EventManager.addListener(document, "mouseup", this);
			}
			break;

		case "mousemove":
			// Resizing
			if (this.isResizing) {
				minWidth = 20;

				delta = e.clientX - this.resizeStart;
				width = this.startWidth + delta;
				nextWidth = this.nextStartWidth - delta;

				if (width > minWidth && nextWidth > minWidth) {
					this.width = width;
					this.handle.style.width = this.width + "px";
					this.nextColumn.handle.style.width = nextWidth + "px";
					this.nextColumn.setWidth(nextWidth);
					this.parent.getItems()[0].adjustWidth();
				}
			}

			// Moving
			if (this.isMoving) {
				if (!e.pageX){e.pageX = e.clientX + document.documentElement.scrollLeft;}
				if (!e.pageY){e.pageY = e.clientY + document.documentElement.scrollTop;}
				this.shadow.handle.style.left = e.pageX + 16 + "px";
				this.shadow.handle.style.top = e.pageY + 16 + "px";
			}
			break;

		case "mouseup":
			// Resizing
			if (this.isResizing) {
				gara.EventManager.removeListener(document, "mousemove", this);
				gara.EventManager.removeListener(document, "mouseup", this);
				this.isResizing = false;
			}

			// Moving
			if (this.isMoving) {
				gara.EventManager.removeListener(document, "mousemove", this);
				gara.EventManager.removeListener(document, "mouseup", this);
				this.isMoving = false;
				this.shadow.dispose();

				delete this.shadow;

				this.shadow = null;

				if (e.target.widget && e.target.widget instanceof gara.jswt.widgets.TableColumn
					&& e.target.widget.getParent() === this.parent) {
					col = e.target.widget; // drag
					colOrder = this.parent.getColumnOrder();
					colIndex = this.parent.getColumns().indexOf(col);
					orderIndex = colOrder.indexOf(colIndex);
					thisColIndex = this.parent.getColumns().indexOf(this);
					colOrder.remove(thisColIndex);
					colOrder.insertAt(orderIndex, thisColIndex);
					this.parent.update();
				}
			}
			break;
		}
	},

	setImage : function (image) {
		this.$super(image);

		// update image
		if (this.image !== null) {
			this.img.src = this.image.src;
			this.img.style.display = "";
		}

		// hide image
		else {
			this.img.src = "";
			this.img.style.display = "none";
		}
		return this;
	},

	setText : function (text) {
		this.$super(text);
		this.spanText.nodeValue = this.text;
		return this;
	},

	setWidth : function (width) {
		this.checkWidget();
		this.width = width;
		this.handle.style.width = this.width + "px";

		return this;
	},

	/**
	 * @method
	 * Unregister listeners for this widget. Implementation for gara.jswt.widgets.Widget
	 *
	 * @private
	 * @return {void}
	 */
	unbindListener : function (eventType, listener) {},

	update : function () {
		var columnOrder;
		this.checkWidget();
		if (this.handle === null) {
			this.create();
		}

		columnOrder = this.parent.getColumnOrder();
		this.setClass("operator", this.parent.getColumns()[columnOrder[columnOrder.length - 1]] !== this);
	}
})});