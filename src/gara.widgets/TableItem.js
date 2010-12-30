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

gara.provide("gara.widgets.TableItem", "gara.widgets.Item");

gara.use("gara.widgets.Table");

/**
 * gara TableItem
 *
 * @class gara.widgets.TableItem
 * @extends gara.widgets.Item
 */
gara.Class("gara.widgets.TableItem", function () { return /** @lends gara.widgets.TableItem# */ {
	$extends : gara.widgets.Item,

	/**
	 * Contains an array of objects with the DOM reference of each cell.
	 *
	 * @private
	 * @type {Object[]}
	 */
	cells : [],

	/**
	 * Contains the checkbox td DOM reference, if check style is present.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	checkboxTd : null,

	/**
	 * Contains the checkbox DOM reference, if check style is present.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	checkbox : null,

	/**
	 * Holds the active state.
	 *
	 * @private
	 * @type {boolean}
	 */
	active : false,

	/**
	 * Holds the checked state.
	 *
	 * @private
	 * @type {boolean}
	 */
	checked : false,

	/**
	 * Holds the grayed state.
	 *
	 * @private
	 * @type {boolean}
	 */
	grayed : false,

	/**
	 * Holds the selected state.
	 *
	 * @private
	 * @type {boolean}
	 */
	selected : false,

	/**
	 * Creates a new TableItem
	 * @constructs
	 * @extends gara.widgets.Item
	 * 
	 * @param {gara.widgets.Table} parent a composite control which will be the parent of the new instance (cannot be null)
	 * @param {int} style the style for the new <code>TableItem</code> (optional)
	 * @param {int} index the zero-relative index to store the receiver in its parent (optional) 
	 */
	$constructor : function (parent, style, index) {
		if (!(parent instanceof gara.widgets.Table)) {
			throw new TypeError("parent is not a gara.widgets.Table");
		}

		this.$super(parent, style);
		this.parentNode = this.parent.addItem(this, index);

		this.cells = [];
		this.checkboxTd = null;
		this.checkbox = null;

		this.active = false;
		this.checked = false;
		this.grayed = false;
		this.selected = false;

		this.createWidget();
	},

	/**
	 * Adjusts the receivers width for a specified column.
	 * 
	 * @private
	 * @param {gara.widgets.TableColumn} column the column that should get its width adjusted
	 * @param {int} width the new width for the specified column
	 */
	adjustWidth : function (column, width) {
		var order = this.parent.getColumnOrder(), i, cell;

		if (column) {
			cell = this.cells[this.parent.getColumns().indexOf(column)];
			if (cell && cell.handle) {
				cell.wrapper.style.width = (width
					- gara.getNumStyle(cell.wrapper, "border-left-width")
					- gara.getNumStyle(cell.wrapper, "border-right-width")
				) + "px";
			}
		}
//		else {
//			for (i = 0, len = order.length; i < len; ++i) {
//				cell = this.cells[order[i]];
//				if (cell && cell.handle) {
//					cell.handle.style.width = this.parent.getColumn(order[i]).getComputedWidth()  + "px";
//				}
//			}
//		}
	},

	/*
	 * jsdoc in gara.widgets.TableItem
	 */
	bindListener : function (eventType, listener) {
		gara.addEventListener(this.handle, eventType, listener);
	},

	/**
	 * Clears the receiver.
	 * 
	 * @private
	 * @returns {void}
	 */
	clear : function () {
		this.checkWidget();
		this.text = "";
		this.image = null;
		this.cells = [];
		this.active = this.checked = this.selected = this.grayed = false;
	},

	/**
	 * Creates the widget.
	 *
	 * @private
	 */
	createWidget : function () {
		var i, cols;
		this.handle = document.createElement("tr");
		this.handle.id = this.getId();
		this.handle.widget = this;
		this.handle.control = this.parent;
		this.handle.setAttribute("role", "row");
		this.addClass("garaTableItem");

		// checkbox
		if ((this.parent.getStyle() & gara.CHECK) === gara.CHECK) {
			this.checkbox = document.createElement("span");
			this.checkbox.widget = this;
			this.checkbox.control = this.tree;
			this.setCheckboxClass();
			this.checkbox.setAttribute("role", "presentation");

			this.checkboxTd = document.createElement("td");
			this.checkboxTd.className = "garaTableItemCell garaCheckboxCell";
			this.checkboxTd.appendChild(this.checkbox);
			this.checkboxTd.setAttribute("role", "presentation");

			this.handle.appendChild(this.checkboxTd);
			this.handle.setAttribute("aria-checked", this.checked);
		}

//		for (var i = 0, cols = this.parent.getColumns().length, cells = this.cells.length; i < cols && i < cells; ++i) {
//			this.cells[i] = this.createCell(i);
//		}
		
		if (!this.parent.getColumnCount() && this.parent.virtualColumn === null) {
			this.parent.update();
		}
		
		this.update();

		this.parentNode.appendChild(this.handle);
		this.parent.updateMeasurements();
	},

	/**
	 * Creates the cell or returns the cell at a given index, if already created.
	 *
	 * @private
	 * @param {int} index the index
	 * @returns {HTMLElement} the cells HTML Node 
	 */
	createCell : function (index) {
//		var index = this.cells.indexOf(cell), i, c,
//			order = this.parent.getColumnOrder(),
//			offset = order.indexOf(index);
		if (this.cells[index]) {
			return this.cells[index];
		}
		
		var cell = {};

		cell.handle = document.createElement("td");
		cell.handle.role = "gridcell";
		cell.handle.className = "garaTableItemCell";
		cell.handle.widget = this;
		cell.handle.control = this.parent;
		cell.index = index;
		cell.handle.setAttribute("aria-labelledby", this.getId() + "-label-"+ index);
		
		cell.wrapper = document.createElement("div");
		cell.wrapper.role = "presentation";
		cell.wrapper.className = "garaTableItemCellWrapper";
		cell.wrapper.widget = this;
		cell.wrapper.control = this.parent;
		cell.handle.appendChild(cell.wrapper);

		cell.img = document.createElement("img");
		cell.img.id = this.getId() + "-image-"+ index;
		cell.img.widget = this;
		cell.img.control = this.parent;
		cell.img.className = "garaItemImage garaTableItemImage";
		cell.img.setAttribute("role", "presentation");
		cell.img.style.display = "none";
		cell.wrapper.appendChild(cell.img);
		
		cell.textNode = document.createTextNode("");
		cell.span = document.createElement("span");
		cell.span.id = this.getId() + "-label-"+ index;
		cell.span.className = "garaItemText garaTableItemText";
		cell.span.widget = this;
		cell.span.control = this.parent;
		cell.span.setAttribute("role", "presentation");
		cell.span.appendChild(cell.textNode);
		cell.wrapper.appendChild(cell.span);

		return cell;
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	destroyWidget : function () {
		this.parent.releaseItem(this);
		this.cells = null;
		this.$super();
	},
	
	/**
	 * Returns a cell at a given index.
	 * 
	 * @param {int} index the index
	 * @returns {HTMLElement} the cell at the given index
	 */
	getCell : function (index) {
		if (!this.cells[index]) {
			this.cells[index] = this.createCell(index);
		}
		return this.cells[index];
	},

	/**
	 * Returns the receiver's checked state.
	 *
	 * @returns {boolean} <code>true</code> for checked and <code>false</code> otherwise
	 */
	getChecked : function () {
		this.checkWidget();
		return this.checked;
	},

	/**
	 * Returns the receiver's grayed state.
	 * 
	 * @returns {boolean} <code>true</code> for grayed and <code>false</code> otherwise
	 */
	getGrayed : function () {
		this.checkWidget();
		return this.grayed;
	},

	/**
	 * Returns the text stored at the given column index in the receiver, or empty string if the 
	 * text has not been set.
	 * 
	 * @param {int} index the column index
	 * @returns {String} the text stored at the given column index in the receiver 
	 */
	getText : function (index) {
		this.checkWidget();
		if (this.cells[index]) {
			return this.cells[index].text;
		}
		return null;
	},

	/**
	 * Returns the image stored at the given column index in the receiver, or null if the image has 
	 * not been set or if the column does not exist.
	 *  
	 * @param {int} index the column index
	 * @returns {String} the image stored at the given column index in the receiver 
	 */
	getImage : function (index) {
		this.checkWidget();
		if (this.cells[index]) {
			return this.cells[index].image;
		}
		return null;
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	handleEvent : function (e) {
		this.checkWidget();

		if ((e.target === this.checkbox	&& e.type === "mousedown")
				|| (e.target === this.checkbox	&& e.type === "mouseup")
				|| (e.type === "keydown" && e.keyCode === gara.SPACE)) {

			e.info = gara.CHECK;
			if (e.type === "mouseup") {
				this.setChecked(!this.checked);
			}
		}
	},

	/**
	 * Sets the receiver's css class based on the grayed and checked state.
	 *
	 * @private
	 * @returns {void}
	 */
	setCheckboxClass : function () {
		this.checkbox.className = "garaCheckbox";
		if (this.checked && this.grayed) {
			this.checkbox.className += " garaCheckboxGrayedChecked";
		} else if (this.grayed) {
			this.checkbox.className += " garaCheckboxGrayed";
		} else if (this.checked) {
			this.checkbox.className += " garaCheckboxChecked";
		}
	},

	/**
	 * Sets the receiver's checked state.
	 *
	 * @param {boolean} checked <code>true</code> for checked and <code>false</code> otherwise
	 * @returns {gara.widgets.TableItem} this
	 */
	setChecked : function (checked) {
		if (!this.grayed) {
			this.checked = checked;
			this.handle.setAttribute("aria-checked", this.checked);
			this.setCheckboxClass();
		}
		return this;
	},

	/**
	 * Sets the receiver's grayed state-
	 * 
	 * @param {boolean} grayed <code>true</code> for grayed and <code>false</code> otherwise
	 * @returns {gara.widgets.TableItem} this
	 */
	setGrayed : function (grayed) {
		this.grayed = grayed;
		this.checkbox.setAttribute("aria-disabled", this.grayed);
		this.setCheckboxClass();
		return this;
	},

	/**
	 * Sets the receiver's image at a given column index.
	 * 
	 * @param {int} index the column index
	 * @param {Image} image the new image
	 * @returns {gara.widgets.TableItem} this
	 */
	setImage : function (index, image) {
		var self = this,
			updateCell = function (index, image) {
				var cell = self.getCell(index);
				cell.image = image;
				if (image !== null) {
					cell.img.src = image.src;
					cell.img.style.display = "";
				} else {
					cell.img.src = "";
					cell.img.style.display = "none";
				}
			};

		this.checkWidget();
		if (!image) {
			image = index;
			index = 0;
		}

		if (typeof(image) === "undefined") {
			return;
		}

		if (image instanceof Array) {
			image.forEach(function (image, index, arr) {
				updateCell(index, image);
			}, this);
		} else {
			updateCell(index, image);
		}

		return this;
	},

	/**
	 * Sets the receiver's selected state.
	 * 
	 * @private
	 * @param {boolean} selected <code>true</code> for selected and <code>false</code> otherwise
	 * @returns {gara.widgets.TableItem} this
	 */
	setSelected : function (selected) {
		this.checkWidget();
		this.selected = selected;
		this.handle.setAttribute('aria-selected', this.selected);
		return this;
	},

	/**
	 * Sets the receiver's text at a given column index.
	 * 
	 * @param {int} index the column index
	 * @param {String} image the new text
	 * @returns {gara.widgets.TableItem} this
	 */
	setText : function (index, text) {
		var self = this,
			updateCell = function (index, text) {
				var cell = self.getCell(index);
				cell.text = text;
				cell.textNode.nodeValue = text;
			};

		this.checkWidget();
		if (typeof(text) === "undefined") {
			text = index;
			index = 0;
		}

		if (text instanceof Array) {
			text.forEach(function (text, index, arr) {
				updateCell(index, text);
			}, this);
		} else {
			updateCell(index, text);
		}

		return this;
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	unbindListener : function (eventType, listener) {
		gara.removeEventListener(this.handle, eventType, listener);
	},

	/**
	 * Updates the receiver
	 * 
	 * @returns {void}
	 */
	update : function () {
		var order, i, cell, len, cols, first = false, virtual;
		this.checkWidget();

		if (this.handle === null) {
			this.createWidget();
		} else {
			while (this.handle.childNodes.length) {
				this.handle.removeChild(this.handle.childNodes[0]);
			}
			if ((this.parent.getStyle() & gara.CHECK) !== 0) {
				this.handle.appendChild(this.checkboxTd);
			}

			order = this.parent.getColumnOrder();
			cols = this.parent.getColumns();
			virtual = order.length === 0;
			for (i = 0, len = order.length || 1; i < len; i++) {
				if (virtual || cols[order[i]].getVisible()) {
					cell = this.getCell(virtual ? 0 : order[i]);
					cell.handle.className ="garaTableItemCell " + (!first ? "garaFirstTableItemCell" : "");
					this.handle.appendChild(cell.handle);
					first = true;
				}
			}
		}
	}
};});