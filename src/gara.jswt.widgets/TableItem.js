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

gara.provide("gara.jswt.widgets.TableItem");

gara.use("gara.EventManager");
gara.use("gara.jswt.JSWT");

gara.require("gara.jswt.widgets.Item");
gara.require("gara.jswt.widgets.Table");

/**
 * gara TableItem
 *
 * @class TableItem
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @extends gara.jswt.widgets.Item
 */
gara.Class("gara.jswt.widgets.TableItem", {
	$extends : gara.jswt.widgets.Item,

	$constructor : function(parent, style, index) {
		if (!gara.instanceOf(parent, gara.jswt.widgets.Table)) {
			throw new TypeError("parent is not a gara.jswt.widgets.Table");
		}

		this.$base(parent, style);

		this._table = parent;
		this._table._addItem(this, index);

		this._cells = [];
		this._checkboxTd = null;
		this._checkbox = null;

		this._active = false;
		this._checked = false;
		this._grayed = false;
		this._selected = false;

		this.handle = null;
	},

	_adjustWidth : function() {
		var order = this._table.getColumnOrder();

		for (var i = 0, len = order.length; i < len; ++i) {
			var cell = this._cells[order[i]];
			cell.td.style.width = this._parent.getColumn(order[i]).getWidth() + "px";
		}
	},

	clear : function() {
		this.checkWidget();
		this._text = "";
		this._image = null;
		this._cells = [];
		this._active = this._checked = this._selected = this._grayed = false;
	},

	_create : function() {
		this.handle = document.createElement("tr");
		this.handle.id = this.getId();
		this.handle.widget = this;
		this.handle.control = this._table;

		base2.DOM.Event(this.handle);
		this.handle.setAttribute("role", "row");


		// checkbox
		if ((this._table.getStyle() & gara.jswt.JSWT.CHECK) == gara.jswt.JSWT.CHECK) {
			this._checkbox = document.createElement("span");
			this._checkbox.widget = this;
			this._checkbox.control = this._tree;
			this._setCheckboxClass();
			base2.DOM.Event(this._checkbox);
			this._checkbox.setAttribute("role", "presentation");

			this._checkboxTd = document.createElement("td");
			this._checkboxTd.className = "jsWTTableCheckboxCol";
			this._checkboxTd.appendChild(this._checkbox);
			base2.DOM.Event(this._checkboxTd);
			this._checkboxTd.setAttribute("role", "presentation");

			this.handle.appendChild(this._checkboxTd);
			this.handle.setAttribute("aria-checked", this._checked);
		}

		var order = this._table.getColumnOrder();
		for (var i = 0, len = order.length; i < len; ++i) {
			var cell = this._cells[order[i]];
			this._createCell(cell);
			this.handle.appendChild(cell.td);
			cell.td.className = i == 0 ? "first" : "";
		}

		this._changed = false;

		if (this._parentNode != null) {
			this._parentNode.appendChild(this.handle);
		}
	},

	_createCell : function(cell) {
		var index = this._cells.indexOf(cell);
		cell.td = document.createElement("td");
		cell.td.role = "gridcell";
		cell.td.widget = this;
		cell.td.control = this._table;
		cell.index = index;

		base2.DOM.Event(cell.td);

		cell.td.setAttribute("aria-labelledby", this.getId() + "-label-"+ index);

		cell.img = document.createElement("img");
		cell.img.id = this.getId() + "-image-"+ index;
		cell.img.widget = this;
		cell.img.control = this._table;
		cell.td.appendChild(cell.img);

		base2.DOM.Event(cell.img);
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
		cell.span.control = this._table;
		cell.span.appendChild(cell.textNode);
		cell.td.appendChild(cell.span);

		base2.DOM.Event(cell.span);
		cell.span.setAttribute("role", "presentation");
	},

	dispose : function() {
		this.$base();

		var cell;
		for (var i = 0, len = this._cells.length; i < len; i++) {
			cell = this._cells[i];
			if (cell.img) {
				cell.td.removeChild(cell.img);
				delete cell.img;
				cell.image = null;
			}
			this.handle.removeChild(cell.td);

			delete cell.td;
		}
		this._cells.clear();
		delete this._cells;

		if (this._parentNode != null) {
			this._parentNode.removeChild(this.handle);
		}

		delete this.handle;
	},

	/**
	 * @method
	 * Returns the checked state for this item
	 *
	 * @author Thomas Gossmann
	 * @return {boolean} the checked state
	 */
	getChecked : function() {
		this.checkWidget();
		return this._checked;
	},

	getGrayed : function() {
		this.checkWidget();
		return this._grayed;
	},

	getText : function(index) {
		this.checkWidget();
		if (this._cells[index]) {
			return this._cells[index].text;
		}
		return null;
	},

	getImage : function(index) {
		this.checkWidget();
		if (this._cells[index]) {
			return this._cells[index].image;
		}
		return null;
	},

	handleEvent : function(e) {
		this.checkWidget();

		if ((e.target == this._checkbox	&& e.type == "mousedown")
				|| (e.target == this._checkbox	&& e.type == "mouseup")
				|| (e.type == "keydown" && e.keyCode == gara.jswt.JSWT.SPACE)) {

			e.info = gara.jswt.JSWT.CHECK;
			if (e.type == "mouseup") {
				this.setChecked(!this._checked);
			}
		}
	},

	_registerListener : function(eventType, listener) {
		if (this.handle != null) {
			gara.EventManager.addListener(this.handle, eventType, listener);
		}
	},

	_setCheckboxClass : function() {
		this._checkbox.className = "jsWTCheckbox";
		if (this._checked && this._grayed) {
			this._checkbox.className += " jsWTCheckboxGrayedChecked";
		} else if (this._grayed) {
			this._checkbox.className += " jsWTCheckboxGrayed";
		} else if (this._checked) {
			this._checkbox.className += " jsWTCheckboxChecked";
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
	setChecked : function(checked) {
		if (!this._grayed) {
			this._checked = checked;
			this.handle.setAttribute("aria-checked", this._checked);
			this._setCheckboxClass();
		}
		return this;
	},

	setGrayed : function(grayed) {
		this._grayed = grayed;
		this._checkbox.setAttribute("aria-disabled", this._grayed);
		this._setCheckboxClass();
		return this;
	},

	setImage : function(index, image) {
		if (!image) {
			image = index;
			index = "x";
		}

		if (typeof(image) == "undefined" || image == null) {
			return;
		}

		if (gara.instanceOf(image, Array)) {
			image.forEach(function(image, index, arr) {
				if (!this._cells[index]) {
					this._cells[index] = {};
				}
				var cell = this._cells[index];
				cell.image = image;
				if (cell.td) {
					cell.img = image.src;
					cell.img.style.display = "";
				}

			}, this);
		} else if (!isNaN(index)) {
			if (!this._cells[index]) {
				this._cells[index] = {};
			}
			var cell = this._cells[index];
			cell.image = image;
			if (cell.td) {
				cell.img = image.src;
				cell.img.style.display = "";
			}
		} else {
			if (!this._cells[0]) {
				this._cells[0] = {};
			}
			var cell = this._cells[0];
			cell.image = image;
			if (cell.td) {
				cell.img = image.src;
				cell.img.style.display = "";
			}
		}

		return this;
	},

	_setSelected : function(selected) {
		this.checkWidget();
		this._selected = selected;
		this.handle.setAttribute('aria-selected', this._selected);
	},

	setText : function(index, text) {
		this.checkWidget();
		if (typeof(text) == "undefined") {
			text = index;
			index = "x";
		}

		if (gara.instanceOf(text, Array)) {
			text.forEach(function(text, index, arr) {
				if (!this._cells[index]) {
					this._cells[index] = {};
				}
				this._cells[index].text = text;
				var cell = this._cells[index];
				cell.text = text;
				if (cell.td) {
					cell.textNode.value = text;
				}
			}, this);
		} else if (!isNaN(index)) {
			if (!this._cells[index]) {
				this._cells[index] = {};
			}
			this._cells[index].text = text;
			var cell = this._cells[index];
			cell.text = text;
			if (cell.td) {
				cell.textNode.value = text;
			}
		} else {
			if (!this._cells[0]) {
				this._cells[0] = {};
			}
			var cell = this._cells[0];
			cell.text = text;
			if (cell.td) {
				cell.textNode.value = text;
			}
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
		if (this.handle != null) {
			gara.EventManager.removeListener(this.handle, eventType, listener);
		}
	},

	update : function() {
		this.checkWidget();

		if (this.handle == null) {
			this._create();
		} else {
			while (this.handle.childNodes.length) {
				this.handle.removeChild(this.handle.childNodes[0]);
			}
			if ((this._table.getStyle() & gara.jswt.JSWT.CHECK) == gara.jswt.JSWT.CHECK) {
				this.handle.appendChild(this._checkboxTd);
			}

			var order = this._table.getColumnOrder();
			for (var i = 0, len = order.length; i < len; i++) {
				var cell = this._cells[order[i]];

				if (!cell.td) {
					this._createCell(cell);
				}
//				else if (this._changed) {
//					if (cell.image) {
//						if (!cell.img) {
//							cell.img = document.createElement("img");
//							cell.img.widget = this;
//							cell.img.control = this._table;
//							cell.td.insertBefore(cell.img, cell.textNode);
//						}
//						cell.img.src = cell.image.src;
//					} else if (!cell.image && cell.img) {
//						cell.td.removeChild(this.img);
//						cell.img = null;
//					}
//					cell.textNode.nodeValue = cell.text;
//				}
				cell.td.className = i == 0 ? "first" : "";
				this.handle.appendChild(cell.td);
			}
		}
	}
});