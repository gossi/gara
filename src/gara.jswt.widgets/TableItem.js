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

gara.provide("gara.jswt.widgets.TableItem", "gara.jswt.widgets.Item");

gara.use("gara.EventManager");
gara.use("gara.jswt.JSWT");
//gara.use("gara.jswt.widgets.Table");

/**
 * gara TableItem
 *
 * @class TableItem
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @extends gara.jswt.widgets.Item
 */
gara.Class("gara.jswt.widgets.TableItem", function () { return {
	$extends : gara.jswt.widgets.Item,

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
		if (!(parent instanceof gara.jswt.widgets.Table)) {
			throw new TypeError("parent is not a gara.jswt.widgets.Table");
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
	adjustWidth : function () {
		var order = this.parent.getColumnOrder(), i, cell;

		for (i = 0, len = order.length; i < len; ++i) {
			cell = this.cells[order[i]];
			if (cell && cell.td) {
				cell.td.style.width = this.parent.getColumn(order[i]).getWidth() + "px";
			}
		}
	},

	/**
	 * @method
	 *
	 * @private
	 */
	bindListener : function (eventType, listener) {
		gara.EventManager.addListener(this.handle, eventType, listener);
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
		var order, i, cell;
		this.handle = document.createElement("tr");
		this.handle.id = this.getId();
		this.handle.widget = this;
		this.handle.control = this.parent;
		this.handle.setAttribute("role", "row");

		// checkbox
		if ((this.parent.getStyle() & gara.jswt.JSWT.CHECK) === gara.jswt.JSWT.CHECK) {
			this.checkbox = document.createElement("span");
			this.checkbox.widget = this;
			this.checkbox.control = this.tree;
			this.setCheckboxClass();
			this.checkbox.setAttribute("role", "presentation");

			this.checkboxTd = document.createElement("td");
			this.checkboxTd.className = "jsWTTableCheckboxCol";
			this.checkboxTd.appendChild(this.checkbox);
			this.checkboxTd.setAttribute("role", "presentation");

			this.handle.appendChild(this.checkboxTd);
			this.handle.setAttribute("aria-checked", this.checked);
		}

		order = this.parent.getColumnOrder();
		for (var i = 0, cols = order.length, cells = this.cells.length; i < cols && i < cells; ++i) {
			cell = this.cells[order[i]];
			this.createCell(cell);
			this.handle.appendChild(cell.td);
			cell.td.className = i === 0 ? "first" : "";
		}

		this.parentNode.appendChild(this.handle);
		this.parent.updateMeasurements();
	},

	/**
	 * @method
	 * Creates the cell
	 *
	 * @private
	 */
	createCell : function (cell) {
		var index = this.cells.indexOf(cell), i, c,
			order = this.parent.getColumnOrder(),
			offset = order.indexOf(index);

		cell.td = document.createElement("td");
		cell.td.role = "gridcell";
		cell.td.widget = this;
		cell.td.control = this.parent;
		cell.index = index;
		cell.td.setAttribute("aria-labelledby", this.getId() + "-label-"+ index);

		cell.img = document.createElement("img");
		cell.img.id = this.getId() + "-image-"+ index;
		cell.img.widget = this;
		cell.img.control = this.parent;
		cell.td.appendChild(cell.img);
		cell.img.setAttribute("role", "presentation");

		if (cell.image) {
			cell.img.src = cell.image.src;
		} else {
			cell.img.style.display = "none";
		}
		cell.textNode = document.createTextNode(cell.text);
		cell.span = document.createElement("span");
		cell.span.id = this.getId() + "-label-"+ index;
		cell.span.className = "text";
		cell.span.widget = this;
		cell.span.control = this.parent;
		cell.span.appendChild(cell.textNode);
		cell.span.setAttribute("role", "presentation");
		cell.td.appendChild(cell.span);

		// append cell to row
		// offset = index of cell in column order
		for (i = 0; i < offset; ++i) {
			c = this.cells[order[i]];

			if (!c.td) {
				this.createCell(c);
			}
			c.td.className = i === 0 ? "first" : "";
		}
		this.handle.appendChild(cell.td);
		cell.td.className = i === 0 ? "first" : "";
	},


	destroyWidget : function () {
//		var cell, i, len;
		this.parent.releaseItem(this);

//		for (i = 0, len = this.cells.length; i < len; i++) {
//			cell = this.cells[i];
//			if (cell.img) {
//				cell.td.removeChild(cell.img);
//				delete cell.img;
//				cell.image = null;
//			}
//			this.handle.removeChild(cell.td);
//
//			delete cell.td;
//		}
		this.cells = null;
		
		this.$super();
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
				|| (e.type === "keydown" && e.keyCode === gara.jswt.JSWT.SPACE)) {

			e.info = gara.jswt.JSWT.CHECK;
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
		this.checkbox.className = "jsWTCheckbox";
		if (this.checked && this.grayed) {
			this.checkbox.className += " jsWTCheckboxGrayedChecked";
		} else if (this.grayed) {
			this.checkbox.className += " jsWTCheckboxGrayed";
		} else if (this.checked) {
			this.checkbox.className += " jsWTCheckboxChecked";
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
			updateCell = function (cell, image) {
				cell.image = image;
				if (!cell.td) {
					self.createCell(cell);
				} else {
					cell.img.src = image.src;
					cell.img.style.display = "";
				}
			};

		if (!image) {
			image = index;
			index = 0;
		}

		if (typeof(image) === "undefined" || image === null) {
			return;
		}

		if (image instanceof Array) {
			image.forEach(function (image, index, arr) {
				if (!this.cells[index]) {
					this.cells[index] = {};
				}
				updateCell(this.cells[index], image);
			}, this);
		} else {
			if (!this.cells[index]) {
				this.cells[index] = {};
			}
			updateCell(this.cells[index], image);
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
			updateCell = function (cell, text) {
				cell.text = text;
				if (!cell.td) {
					self.createCell(cell);
				} else {
					cell.textNode.value = text;
				}
			};

		this.checkWidget();
		if (typeof(text) === "undefined") {
			text = index;
			index = 0;
		}

		if (text instanceof Array) {
			text.forEach(function (text, index, arr) {
				if (!this.cells[index]) {
					this.cells[index] = {};
				}
				updateCell(this.cells[index], text);
			}, this);
		} else {
			if (!this.cells[index]) {
				this.cells[index] = {};
			}
			updateCell(this.cells[index], text);
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
	unbindListener : function (eventType, listener) {
		gara.EventManager.removeListener(this.handle, eventType, listener);
	},

	update : function () {
		var order, i, cell;
		this.checkWidget();

		if (this.handle === null) {
			this.create();
		} else {
			while (this.handle.childNodes.length) {
				this.handle.removeChild(this.handle.childNodes[0]);
			}
			if ((this.parent.getStyle() & gara.jswt.JSWT.CHECK) === gara.jswt.JSWT.CHECK) {
				this.handle.appendChild(this.checkboxTd);
			}

			order = this.parent.getColumnOrder();
			for (i = 0, len = order.length; i < len; i++) {
				cell = this.cells[order[i]];

				if (!cell.td) {
					this.createCell(cell);
				}
				cell.td.className = i === 0 ? "first" : "";
				this.handle.appendChild(cell.td);
			}
		}
	}
};});