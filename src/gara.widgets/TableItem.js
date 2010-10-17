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

gara.provide("gara.widgets.TableItem", "gara.widgets.Item");

gara.use("gara.widgets.Table");

/**
 * gara TableItem
 *
 * @class TableItem
 * @author Thomas Gossmann
 * @namespace gara.widgets
 * @extends gara.widgets.Item
 */
gara.Class("gara.widgets.TableItem", function () { return {
	$extends : gara.widgets.Item,

	/**
	 * @field
	 * Contains an array of objects with the DOM reference of each cell.
	 *
	 * @private
	 * @type {Object[]}
	 */
	cells : [],

	/**
	 * @field
	 * Contains the checkbox td DOM reference, if check style is present.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	checkboxTd : null,

	/**
	 * @field
	 * Contains the checkbox DOM reference, if check style is present.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	checkbox : null,

	/**
	 * @field
	 * Holds the active state.
	 *
	 * @private
	 * @type {boolean}
	 */
	active : false,

	/**
	 * @field
	 * Holds the checked state.
	 *
	 * @private
	 * @type {boolean}
	 */
	checked : false,

	/**
	 * @field
	 * Holds the grayed state.
	 *
	 * @private
	 * @type {boolean}
	 */
	grayed : false,

	/**
	 * @field
	 * Holds the selected state.
	 *
	 * @private
	 * @type {boolean}
	 */
	selected : false,

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
	 * @method
	 *
	 * @private
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

	/**
	 * @method
	 *
	 * @private
	 */
	bindListener : function (eventType, listener) {
		gara.addEventListener(this.handle, eventType, listener);
	},

	clear : function () {
		this.checkWidget();
		this.text = "";
		this.image = null;
		this.cells = [];
		this.active = this.checked = this.selected = this.grayed = false;
	},

	/**
	 * @method
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
	 * @method
	 * Creates the cell
	 *
	 * @private
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


	destroyWidget : function () {
		this.parent.releaseItem(this);
		this.cells = null;
		this.$super();
	},
	
	getCell : function (index) {
		if (!this.cells[index]) {
			this.cells[index] = this.createCell(index);
		}
		return this.cells[index];
	},

	/**
	 * @method
	 * Returns the checked state for this item
	 *
	 * @author Thomas Gossmann
	 * @return {boolean} the checked state
	 */
	getChecked : function () {
		this.checkWidget();
		return this.checked;
	},

	getGrayed : function () {
		this.checkWidget();
		return this.grayed;
	},

	getText : function (index) {
		this.checkWidget();
		if (this.cells[index]) {
			return this.cells[index].text;
		}
		return null;
	},

	getImage : function (index) {
		this.checkWidget();
		if (this.cells[index]) {
			return this.cells[index].image;
		}
		return null;
	},

	/**
	 * @method
	 *
	 * @private
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
	 * @method
	 *
	 * @private
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
	 * @method
	 * Sets the checked state for this item
	 *
	 * @author Thomas Gossmann
	 * @param {boolean} checked the new checked state
	 * @return {void}
	 */
	setChecked : function (checked) {
		if (!this.grayed) {
			this.checked = checked;
			this.handle.setAttribute("aria-checked", this.checked);
			this.setCheckboxClass();
		}
		return this;
	},

	setGrayed : function (grayed) {
		this.grayed = grayed;
		this.checkbox.setAttribute("aria-disabled", this.grayed);
		this.setCheckboxClass();
		return this;
	},

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
	 * @method
	 *
	 * @private
	 */
	setSelected : function (selected) {
		this.checkWidget();
		this.selected = selected;
		this.handle.setAttribute('aria-selected', this.selected);
	},

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

	/**
	 * @method
	 * Unregister listeners for this widget. Implementation for gara.widgets.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	unbindListener : function (eventType, listener) {
		gara.removeEventListener(this.handle, eventType, listener);
	},

	update : function () {
		var order, i, cell, len, cols, first = false;
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

			order = this.parent.getColumnOrder(), cols = this.parent.getColumns();
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