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
 * gara TableItem
 *
 * @class TableItem
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @extends gara.jswt.Item
 */
$class("TableItem", {
	$extends : gara.jswt.Item,

	$constructor : function(parent, style, index) {
		if (!$class.instanceOf(parent, gara.jswt.Table)) {
			throw new TypeError("parent is not a gara.jswt.Table");
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

		this.domref = null;
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
		this.domref = document.createElement("tr");
		this.domref.obj = this;
		this.domref.control = this._table;
		base2.DOM.EventTarget(this.domref);

		this._checkbox = document.createElement("input");
		this._checkbox.type = "checkbox";
		this._checkbox.obj = this;
		this._checkbox.control = this._table;
		if (this._grayed) {
			this._checkbox.disabled = true;
		}
		if (this._checked) {
			this._checkbox.checked = true;
		}
		this._checkboxTd = document.createElement("td");
		this._checkboxTd.appendChild(this._checkbox);
		if ((this._table.getStyle() & JSWT.CHECK) == JSWT.CHECK) {
			this.domref.appendChild(this._checkboxTd);
		}
		base2.DOM.EventTarget(this._checkbox);
		gara.EventManager.addListener(this._checkbox, "mousedown", this);
		gara.EventManager.addListener(this._checkbox, "keydown", this);

		var order = this._table.getColumnOrder();
		for (var i = 0, len = order.length; i < len; ++i) {
			var cell = this._cells[order[i]];
			cell.td = document.createElement("td");
			cell.td.obj = this;
			cell.td.control = this._table;
			base2.DOM.EventTarget(cell.td);
			this.domref.appendChild(cell.td);

			if (cell.image) {
				cell.img = document.createElement("img");
				cell.img.obj = this;
				cell.img.control = this._table;
				cell.img.src = cell.image.src;
				base2.DOM.EventTarget(cell.img);
				cell.td.appendChild(cell.img);
			}
			cell.textNode = document.createTextNode(cell.text);
			cell.td.appendChild(cell.textNode);
		}

		this._changed = false;

		if (this._parentNode != null) {
			this._parentNode.appendChild(this.domref);
		}
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
			this.domref.removeChild(cell.td);

			delete cell.td;
		}
		this._cells.clear();
		delete this._cells;

		if (this._parentNode != null) {
			this._parentNode.removeChild(this.domref);
		}

		delete this.domref;
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
		this._checked = this._checkbox.checked;
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

		if (e.target == this._checkbox
				&& (e.type == "mousedown"
					|| e.type == "keydown" && e.keyCode == 32)) {
			e.garaDetail = gara.jswt.JSWT.CHECK;
		}
	},

	_registerListener : function(eventType, listener) {

	},

	setActive : function(active) {
		this._active = active;
	},

	setChecked : function(checked) {
		if (!this._grayed) {
			this._checked = checked;
			if (this._checked) {
				this._checkbox.checked = true;
			} else {
				this._checkbox.checked = false;
			}
		}
	},

	setGrayed : function(grayed) {
		this._grayed = grayed;
		if (this._grayed) {
			this._checkbox.disabled = true;
		} else {
			this._checkbox.disabled = false;
		}
	},

	setImage : function(index, image) {
		if (!image) {
			image = index;
		}

		if (typeof(image) == "undefined" || image == null) {
			return;
		}

		if ($class.instanceOf(image, Array)) {
			image.forEach(function(image, index, arr) {
				if (!this._cells[index]) {
					this._cells[index] = {};
				}
				this._cells[index].image = image;
			}, this);
		} else if (!isNaN(index)) {
			if (!this._cells[index]) {
				this._cells[index] = {};
			}
			this._cells[index].image = image;
		} else {
			if (!this._cells[0]) {
				this._cells[0] = {};
			}
			this._cells[0].image = image;
		}

		this._changed = true;
	},

	_setSelected : function(selected) {
		this.checkWidget();
		this._selected = selected;
		this._changed = true;
	},

	setText : function(index, text) {
		this.checkWidget();
		if (typeof(text) == "undefined") {
			text = index;
		}

		if ($class.instanceOf(text, Array)) {
			text.forEach(function(text, index, arr) {
				if (!this._cells[index]) {
					this._cells[index] = {};
				}
				this._cells[index].text = text;
			}, this);
		} else if (!isNaN(index)) {
			if (!this._cells[index]) {
				this._cells[index] = {};
			}
			this._cells[index].text = text;
		} else {
			if (!this._cells[0]) {
				this._cells[0] = {};
			}
			this._cells[0].text = text;
		}

		this._changed = true;
	},

	toString : function() {
		return "[gara.jswt.TableItem]";
	},

	/**
	 * @method
	 * Unregister listeners for this widget. Implementation for gara.jswt.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_unregisterListener : function(eventType, listener) {},

	update : function() {
		this.checkWidget();

		if (this.domref == null) {
			this._create();
		} else {
			while (this.domref.childNodes.length) {
				this.domref.removeChild(this.domref.childNodes[0]);
			}
			if ((this._table.getStyle() & JSWT.CHECK) == JSWT.CHECK) {
				this.domref.appendChild(this._checkboxTd);
			}

			var order = this._table.getColumnOrder();
			for (var i = 0, len = order.length; i < len; ++i) {
				var cell = this._cells[order[i]];

				if (this.hasChanged()) {
					if (!cell.td) {
						cell.td = document.createElement("td");
						cell.td.obj = this;
						cell.td.control = this._table;
						base2.DOM.EventTarget(cell.td);
						cell.textNode = document.createTextNode(cell.text);
						cell.td.appendChild(cell.textNode);
					}

					if (cell.image) {
						if (!cell.img) {
							cell.img = document.createElement("img");
							cell.img.obj = this;
							cell.img.control = this._table;

							base2.DOM.EventTarget(cell.img);
							cell.td.insertBefore(cell.img, cell.textNode);
						}
						cell.img.src = cell.image.src;
					}

					cell.td.className = "";

					if (this._selected && i == 0) {
						cell.td.className = "selected";
					}

					cell.textNode.nodeValue = cell.text;
				}

				this.domref.appendChild(cell.td);
			}
		}

		this.removeClassName("selected");

		if (this._selected) {
			this.addClassName("selected");
		}

		this.domref.className = this._className;
		this.releaseChange();
	}
});