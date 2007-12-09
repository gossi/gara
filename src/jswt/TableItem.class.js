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

	$constructor : function(parent, style) {
		if (!$class.instanceOf(parent, gara.jswt.Table)) {
			throw new TypeError("parent is not a gara.jswt.Table");
		}

		this.$base(parent, style);

		this._table = parent;
		this._table._addItem(this);

		this._cells = [];

		this._active = false;
		this._checked = false;
		this._selected = false;

		this.domref = null;
	},

	_create : function() {
		this.domref = document.createElement("tr");
		this.domref.obj = this;
		this.domref.control = this._table;
		base2.DOM.EventTarget(this.domref);

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
	},

	getText : function(index) {
		if (this._cells[index]) {
			return this._cells[index].text;
		}
		return null;
	},

	getImage : function(index) {
		if (this._cells[index]) {
			return this._cells[index].image;
		}
		return null;
	},

	handleEvent : function(e) {
		
	},

	registerListener : function(eventType, listener) {
		
	},

	setActive : function(active) {
		this._active = active;
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

	setSelected : function(selected) {
		this._selected = selected;
		this._changed = true;
	},

	setText : function(index, text) {
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

	update : function() {
		while (this.domref.childNodes.length) {
			this.domref.removeChild(this.domref.childNodes[0]);
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

				cell.textNode.value = cell.text;
			}

			this.domref.appendChild(cell.td);
		}

		this.removeClassName("selected");

		if (this._selected) {
			this.addClassName("selected");
		}

		this.domref.className = this._className;
		this.releaseChange();
	}
});