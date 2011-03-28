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

gara.provide("gara.widgets.TableColumn", "gara.widgets.Item");

gara.use("gara.widgets.TableItem");
gara.use("gara.widgets.Table");
gara.use("gara.widgets.MenuItem");

/**
 * gara TableColumn
 *
 * @class gara.widgets.TableColumn
 * @extends gara.widgets.Item
 */
gara.Class("gara.widgets.TableColumn", function() { return /** @lends gara.widgets.TableColumn# */ {
	$extends : gara.widgets.Item,

	/**
	 * Contains a shadow copy of the <code>Table</code> that is used, when
	 * moving columns.
	 *
	 * @private
	 * @type {gara.widgets.Table}
	 */
	shadow : null,

	/**
	 * Width of this column.
	 *
	 * @private
	 * @type {int}
	 */
	width : 0,

	/**
	 * Image's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	img : null,

	/**
	 * Text's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	span : null,

	/**
	 * Text's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	spanText : null,

	/**
	 * Operator's DOM reference.
	 *
	 * @private
	 * @type {}
	 */
	resizer : null,


	/**
	 * Holds the moveable flag.
	 *
	 * @private
	 * @type {boolean}
	 */
	moveable : true,

	/**
	 * Holds the resizable flag.
	 *
	 * @private
	 * @type {boolean}
	 */
	resizable : true,


	/**
	 * Holds the flag wether this column is currently being moved.
	 *
	 * @private
	 * @type {boolean}
	 */
	isMoving : false,

	/**
	 * Holds the flag wether this column is currently being resized.
	 *
	 * @private
	 * @type {boolean}
	 */
	isResizing : false,

	/**
	 * Creates a new TableColumn
	 * 
	 * @constructs
	 * @extends gara.widgets.Item
	 * 
	 * @param parent
	 * @param style
	 * @param index
	 */
	$constructor : function (parent, style, index) {
		var menuItemListener;
		if (!(parent instanceof gara.widgets.Table)) {
			throw new TypeError("parent is not a gara.widgets.Table");
		}

		this.$super(parent, style);

		this.parentNode = this.parent.addColumn(this, index);
		this.shadow = null;

		this.minWidth = 17;
		this.width = null;
		this.img = null;
		this.span = null;
		this.spanText = null;
		this.resizer = null;

		this.moveable = true;
		this.resizable = true;
		this.visible = true;
		
		menuItemListener = {
			widgetSelected : function (e) {
				var visibleCount = 0;
				e.widget.getData().getColumns().forEach(function (col) {
					if (col.getVisible()) {
						visibleCount++;
					}
				});
				
				e.item.removeSelectionListener(menuItemListener);
				if (visibleCount === 1 && !e.item.getSelection()) {
					e.item.setSelection(true);
				} else {
					e.item.getData().setVisible(!e.item.getData().getVisible());
					
				}
				e.item.addSelectionListener(menuItemListener);
				e.widget.getData().setFocus();
			}
		};
		this.colMenuItem = new gara.widgets.MenuItem(this.parent.colMenu, gara.CHECK).setSelection(true).setData(this);
		this.colMenuItem.addSelectionListener(menuItemListener);

		this.isMoving = false;
		this.isResizing = false;
		this.createWidget();
	},
	
	/**
	 * Adjust the width of the receiver. For internal usage only.
	 * 
	 * @private
	 * @param {int} width the new width
	 * @returns {void}
	 */
	adjustWidth : function (width) {
//		this.span.style.width = "auto";
		width = width < this.minWidth ? this.minWidth : width;
		if (width === null) {
			this.col.removeAttribute("width");
		} else {
			this.col.width = width;
		}
		
		width = width 
			- gara.getNumStyle(this.handle, "padding-left")
			- gara.getNumStyle(this.handle, "padding-right")
			- gara.getNumStyle(this.handle, "border-left-width")
			- gara.getNumStyle(this.handle, "border-right-width");
		this.handle.style.width = width + "px";

		this.span.style.width = (width 
			- (this.image !== null ? this.img.offsetWidth : 0)
			- gara.getNumStyle(this.span, "padding-left")
			- gara.getNumStyle(this.span, "padding-right")
//			- gara.getNumStyle(this.span, "margin-right") // buggy in Webkit: When setting the width to a value < th.clientWidth, webkit adds the difference to right margin
			- gara.getNumStyle(this.span, "margin-left")
			- this.resizer.offsetWidth
		) + "px";
		
		this.parent.adjustedColWidth(this, this.handle.offsetWidth);

//		return this.col.width;
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	bindListener : function () {},

	/**
	 * Creates the widget
	 * 
	 * @private
	 */
	createWidget : function () {
		var thead, tableCols, cols, colsWidth, i, width, parentWidth;
		this.handle = document.createElement("th");
		this.handle.id = this.getId();
		this.handle.widget = this;
		this.handle.control = this.parent;
		this.handle.setAttribute("role", "columnheader");
		this.handle.setAttribute("aria-labelledby", this.getId() + "-label");
		this.handle.setAttribute("unselectable", "on");
		this.addClass("garaTableHeadColumn");

		// create image node
		this.img = document.createElement("img");
		this.img.id = this.getId() + "-image";
		this.img.widget = this;
		this.img.control = this.tree;
		this.img.className = "garaItemImage garaTableColumnImage";
		this.img.setAttribute("role", "presentation");
		this.img.setAttribute("unselectable", "on");

		// set image
		if (this.image !== null) {
			this.img.src = this.image.src;
		} else {
			this.img.style.display = "none";
		}

		// operator node
		this.resizer = document.createElement("span");
		this.resizer.className = "garaTableColumnResizer";
		this.resizer.id = this.getId() + "-resizer";
		this.resizer.widget = this;
		this.resizer.control = this.parent;
		this.resizer.setAttribute("role", "presentation");
		this.resizer.setAttribute("unselectable", "on");

		// text node
		this.span = document.createElement("div");
		this.span.id = this.getId() + "-label";
		this.span.widget = this;
		this.span.control = this.parent;
		this.span.className = "garaItemText garaTableColumnText";
		this.spanText = document.createTextNode(this.text);
		this.span.appendChild(this.spanText);
		this.span.setAttribute("role", "presentation");
		this.span.setAttribute("unselectable", "on");

		// add nodes
		this.handle.appendChild(this.img);
		this.handle.appendChild(this.resizer);
		this.handle.appendChild(this.span);
		
		// add col
		this.col = document.createElement("col");
		this.parent.colGroup.appendChild(this.col);

		if (this.parentNode !== null) {
			thead = this.parentNode.parentNode;
			thead.style.position = "relative";
			this.parentNode.appendChild(this.handle);

			tableCols = this.parent.getColumns();
			cols = [];
			colsWidth = 0;

			// get parent width
			parentWidth = this.parent.handle.clientWidth - gara.SCROLLBAR_WIDTH;
			if ((this.parent.getStyle() & gara.CHECK) !== 0) {
				parentWidth -= this.parent.checkboxCell.offsetWidth;
			}

			// find cols for width change
			tableCols.forEach(function (col, index) {
				if (!col.getWidth()) {
					cols.add(col);	
				}
			}, this);

			cols.forEach(function (col, index) {
				var colWidth;
				colWidth = Math.floor(parentWidth / cols.length);
				colsWidth += col.adjustWidth(index === cols.length - 1 ? width - colsWidth : colWidth);
			}, this);

			thead.style.position = "absolute";
		}

		this.parent.updateMeasurements();
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	destroyWidget : function () {
		this.parent.releaseColumn(this);
				
		this.colMenuItem = null;
		this.shadow = null;
		
		this.$super();
	},

	/**
	 * 
	 * @private
	 */
	getComputedWidth : function () {
		this.checkWidget();
		if (this.handle !== null && this.handle.style.display !== "none") {
			return this.handle.offsetWidth;
		}
		return 0;
	},
	
	/**
	 * Gets the moveable attribute.
	 * 
	 * @description
	 * Gets the moveable attribute. A column that is not moveable cannot be reordered by the user by 
	 * dragging the header but may be reordered by the programmer.
	 * 
	 * @returns {boolean} the movable attribute
	 */
	getMoveable : function () {
		return this.moveable;
	},

	/**
	 * Returns the receiver's minimum width.
	 * 
	 * @returns {int} the minimum width 
	 */
	getMinWidth : function () {
		return this.minWidth;
	},
	
	/**
	 * Gets the resizable attribute.
	 * 
	 * @description
	 * Gets the resizable attribute. A column that is not resizable cannot be dragged by the user 
	 * but may be resized by the programmer.
	 *  
	 * @returns {boolean} the resizable attribute
	 */
	getResizable : function () {
		return this.resizable;
	},

	/**
	 * Returns the receiver's visibility state.
	 * 
	 * @returns {boolean} <code>true</code> for visible and <code>false</code> for hidden.
	 */
	getVisible : function () {
		return this.visible;
	},

	/**
	 * Gets the width of the receiver.
	 * 
	 * @returns {int} the width
	 */
	getWidth : function () {
		this.checkWidget();
		return this.width;
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	handleEvent : function (e) {
		var order, thisColumnIndex, thisColumnOrder, columns, offset,
			minWidth, delta, nextWidth, width,
			col, colOrder, colIndex, orderIndex, thisColIndex;
		this.checkWidget();
		switch(e.type) {
		case "mousedown":
			// Resizing Column
			if (e.target === this.resizer && this.parent.getColumnCount() > 1 && this.resizable) {
				this.isResizing = true;

				this.resizeLineLeft = (this.parent.getStyle() & gara.CHECK) !== 0
					? parseInt(this.parent.checkboxCol.width, 10) : 0;
				this.allColsWidth = 0;
				
				order = this.parent.getColumnOrder();
				columns = this.parent.getColumns();
				
				thisColumnIndex = columns.indexOf(this);
				thisColumnOrder = order.indexOf(thisColumnIndex);
				
				order.forEach(function (index, orderIndex) {
					var col = columns[index], width = col.getComputedWidth();
					this.allColsWidth += width;
					if (orderIndex <= thisColumnOrder) {
						this.resizeLineLeft += width;
					}
				}, this);
				
				this.nextColumn = columns[order[thisColumnOrder + 1]];
				this.lessColsWidth = this.allColsWidth - this.getComputedWidth() - this.nextColumn.getComputedWidth();

				this.resizeStart = e.clientX;
				this.startWidth = this.getComputedWidth();
				this.nextStartWidth = this.nextColumn.getComputedWidth();

				// show resize line
				this.parent.resizeLine.style.display = "block";
				this.parent.resizeLine.style.left = this.resizeLineLeft + "px";

				gara.addEventListener(document, "mousemove", this);
				gara.addEventListener(document, "mouseup", this);
			}

			// Moving Column
			if ((e.target === this.handle || e.target === this.span) && this.parent.getColumnCount() > 1 && this.moveable) {
				this.isMoving = true;

				order = this.parent.getColumns();
				offset = order.indexOf(this);

				this.shadow = new gara.widgets.Table(document.getElementsByTagName("body")[0], this.parent.getStyle() &~ gara.CHECK);
				this.shadow.setHeaderVisible(this.parent.getHeaderVisible());
				this.shadow.setLinesVisible(this.parent.getLinesVisible());
				this.shadow.setHeight(this.parent.handle.offsetHeight);
				this.shadow.setWidth(this.handle.offsetWidth);
				this.shadow.addClass("garaTableShadow");
				
				new gara.widgets.TableColumn(this.shadow).setText(this.getText()).setImage(this.getImage());

				this.parent.getItems().forEach(function (item) {
					new gara.widgets.TableItem(this.shadow).setText(item.getText(offset)).setImage(item.getImage(offset));
				}, this);

//					this.shadow.update();
				if (!e.pageX){e.pageX = e.clientX + document.documentElement.scrollLeft;}
				if (!e.pageY){e.pageY = e.clientY + document.documentElement.scrollTop;}
				this.shadow.handle.style.left = e.pageX + 16 + "px";
				this.shadow.handle.style.top = e.pageY + 16 + "px";

				gara.addEventListener(document, "mousemove", this);
				gara.addEventListener(document, "mouseup", this);
			}
			break;

		case "mousemove":
			// Resizing
			if (this.isResizing) {

				delta = e.clientX - this.resizeStart;
				width = this.startWidth + delta;
				nextWidth = this.nextStartWidth - delta;

				if (width > this.minWidth && nextWidth > this.minWidth) {
					this.setWidth(width);
					this.nextColumn.setWidth(nextWidth);
					this.parent.resizeLine.style.left = (this.resizeLineLeft + delta) + "px";
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
				gara.removeEventListener(document, "mousemove", this);
				gara.removeEventListener(document, "mouseup", this);
				this.parent.resizeLine.style.display = "none";
				this.isResizing = false;
			}

			// Moving
			if (this.isMoving) {
				gara.removeEventListener(document, "mousemove", this);
				gara.removeEventListener(document, "mouseup", this);
				this.isMoving = false;
				this.shadow.dispose();
				this.shadow = null;

				if (e.target.widget && e.target.widget instanceof gara.widgets.TableColumn
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
			
		case "contextmenu":
			e.preventDefault();
			break;
		}
	},

	/*
	 * jsdoc in gara.widgets.Item
	 */
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
		this.colMenuItem.setImage(image);
		delete this.parent.colMenu.offsetWidth;
		return this;
	},

	/*
	 * jsdoc in gara.widgets.Item
	 */
	setText : function (text) {
		this.$super(text);
		this.spanText.nodeValue = this.text;
		this.colMenuItem.setText(text);
		delete this.parent.colMenu.offsetWidth;
		return this;
	},
	
	/**
	 * Sets the moveable attribute.
	 * 
	 * @description
	 * Sets the moveable attribute. A column that is moveable can be reordered by the user by dragging 
	 * the header. A column that is not moveable cannot be dragged by the user but may be reordered 
	 * by the programmer.
	 *  
	 * @param {boolean} moveable the moveable attribute
	 * @returns {gara.widgets.TableColumn} this
	 */
	setMoveable : function (moveable) {
		this.moveable = moveable;
		return this;
	},
	
	/**
	 * Sets the receiver's minimum width.
	 * 
	 * @param {int} width the new minimum width
	 * @returns {gara.widgets.TableColumn} this
	 */
	setMinWidth : function (width) {
		this.minWidth = width;
		return this;
	},
	
	/**
	 * Sets the resizable attribute.
	 * 
	 * @description
	 * Sets the resizable attribute. A column that is resizable can be resized by the user dragging 
	 * the edge of the header. A column that is not resizable cannot be dragged by the user but may 
	 * be resized by the programmer.
	 *  
	 * @param {boolean} resizable the resizable attribute
	 * @returns {gara.widgets.TableColumn} this
	 */
	setResizable : function (resizable) {
		this.resizable = resizable;
		return this;
	},
	
	/**
	 * Sets the receiver's visibility.
	 * 
	 * @param {boolean} visible <code>true</code> for visible or <code>false</code> for invisible
	 * @returns {gara.widgets.TableColumn} this
	 */
	setVisible : function (visible) {
		this.visible = visible;
		this.colMenuItem.setSelection(visible);
		this.parent.update();
	},

	/**
	 * Sets the receiver's width.
	 *  
	 * @param {int} width the new width
	 * @returns {gara.widgets.TableColumn} this
	 */
	setWidth : function (width) {
		this.checkWidget();
		this.width = width > this.minWidth || width === null ? width : this.minWidth;
		if (width !== null) {
			this.adjustWidth(width);
		}
		this.parent.updateMeasurements();

		return this;
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	unbindListener : function (eventType, listener) {}
};});