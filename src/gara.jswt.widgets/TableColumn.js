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
gara.use("gara.jswt.widgets.Table");
gara.use("gara.jswt.widgets.MenuItem");

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
	resizer : null,


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
		var menuItemListener;
		if (!(parent instanceof gara.jswt.widgets.Table)) {
			throw new TypeError("parent is not a gara.jswt.widgets.Table");
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
		this.colMenuItem = new gara.jswt.widgets.MenuItem(this.parent.colMenu, gara.jswt.JSWT.CHECK).setSelection(true).setData(this);
		this.colMenuItem.addSelectionListener(menuItemListener);

		this.isMoving = false;
		this.isResizing = false;
		this.createWidget();
	},
	
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

	/**
	 * @method
	 *
	 * @private
	 */
	bindListener : function () {},

	createWidget : function () {
		var thead, tableCols, cols, colsWidth, colWidths, i, width, parentWidth;
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
			colsWidths = 0;

			// get parent width
			parentWidth = this.parent.handle.clientWidth - gara.jswt.JSWT.SCROLLBAR_WIDTH;
			if ((this.parent.getStyle() & gara.jswt.JSWT.CHECK) !== 0) {
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
				colWidths += col.adjustWidth(index === cols.length - 1 ? width - colWidths : colWidth);
			}, this);

			thead.style.position = "absolute";
		}

		this.parent.updateMeasurements();
	},

	destroyWidget : function () {
		this.parent.releaseColumn(this);
				
		this.colMenuItem = null;
		this.shadow = null;
		
		this.$super();
	},

	/**
	 * @method
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
	
	getMoveable : function () {
		return this.moveable;
	},

	getMinWidth : function () {
		return this.minWidth;
	},
	
	getResizable : function () {
		return this.resizable;
	},

	getVisible : function () {
		return this.visible;
	},

	getWidth : function () {
		this.checkWidget();
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
			if (e.target === this.resizer && this.parent.getColumnCount() > 1 && this.resizable) {
				this.isResizing = true;

				this.resizeLineLeft = (this.parent.getStyle() & gara.jswt.JSWT.CHECK) !== 0
					? parseInt(this.parent.checkboxCol.width) : 0;
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

				gara.EventManager.addListener(document, "mousemove", this);
				gara.EventManager.addListener(document, "mouseup", this);
			}

			// Moving Column
			if ((e.target === this.handle || e.target === this.span) && this.parent.getColumnCount() > 1 && this.moveable) {
				this.isMoving = true;

				order = this.parent.getColumns();
				offset = order.indexOf(this);

				this.shadow = new gara.jswt.widgets.Table(document.getElementsByTagName("body")[0], this.parent.getStyle() &~ gara.jswt.JSWT.CHECK);
				this.shadow.setHeaderVisible(this.parent.getHeaderVisible());
				this.shadow.setLinesVisible(this.parent.getLinesVisible());
				this.shadow.setHeight(this.parent.handle.offsetHeight);
				this.shadow.setWidth(this.handle.offsetWidth);
				this.shadow.addClass("garaTableShadow");
				
				new gara.jswt.widgets.TableColumn(this.shadow).setText(this.getText()).setImage(this.getImage());

				this.parent.getItems().forEach(function (item) {
					new gara.jswt.widgets.TableItem(this.shadow).setText(item.getText(offset)).setImage(item.getImage(offset));
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
				gara.EventManager.removeListener(document, "mousemove", this);
				gara.EventManager.removeListener(document, "mouseup", this);
				this.parent.resizeLine.style.display = "none";
				this.isResizing = false;
			}

			// Moving
			if (this.isMoving) {
				gara.EventManager.removeListener(document, "mousemove", this);
				gara.EventManager.removeListener(document, "mouseup", this);
				this.isMoving = false;
				this.shadow.dispose();
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
			
		case "contextmenu":
			e.preventDefault();
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
		this.colMenuItem.setImage(image);
		delete this.parent.colMenu.offsetWidth;
		return this;
	},

	setText : function (text) {
		this.$super(text);
		this.spanText.nodeValue = this.text;
		this.colMenuItem.setText(text);
		delete this.parent.colMenu.offsetWidth;
		return this;
	},
	
	setMoveable : function (moveable) {
		this.moveable = moveable;
		return this;
	},
	
	setMinWidth : function (width) {
		this.minWidth = width;
	},
	
	setResizable : function (resizable) {
		this.resizable = resizable;
		return this;
	},
	
	setVisible : function (visible) {
		this.visible = visible;
		this.colMenuItem.setSelection(visible);
		this.parent.update();
	},

	setWidth : function (width) {
		this.checkWidget();
		this.width = width > this.minWidth || width === null ? width : this.minWidth;
		if (width !== null) {
			this.adjustWidth(width);
		}
		this.parent.updateMeasurements();

		return this;
	},

	/**
	 * @method
	 * Unregister listeners for this widget. Implementation for gara.jswt.widgets.Widget
	 *
	 * @private
	 * @return {void}
	 */
	unbindListener : function (eventType, listener) {}
});});