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

function getStyle(el, styleProp, ieStyleProp)
{
	var x = el;
	if (x.currentStyle)
		var y = x.currentStyle[ieStyleProp];
	else if (window.getComputedStyle)
		var y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
	return y;
}

/**
 * gara TableColumn
 * 
 * @class TableColumn
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @extends Item
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
		base2.DOM.EventTarget(this.domref);

		if (this._image != null) {
			this._img = document.createElement("img");
			this._img.obj = this;
			this._img.control = this._table;
			this._img.src = this._image.src;
			base2.DOM.EventTarget(this._img);

			this.domref.appendChild(this._img);
		}

		this._operator = document.createElement("span");
		this._operator.obj = this;
		this._operator.control = this._table;
		base2.DOM.EventTarget(this._operator);
		this.domref.appendChild(this._operator);

		this._spanText = document.createTextNode(this._text);
		this.domref.appendChild(this._spanText);
	},
	
	_computeWidth : function() {
		if (this.domref != null) {
			var paddingLeft = getStyle(this.domref, "padding-left", "paddingLeft");
			var paddingRight = getStyle(this.domref, "padding-right", "paddingRight");
			this._width = this.domref.clientWidth - parseInt(paddingLeft) - parseInt(paddingRight); 
		}
	},
	
	getWidth : function() {
		if (this._width == null || this._width == "auto") {
			this._computeWidth();
		}
		
		return this._width;
	},
	
	handleEvent : function(e) {
		switch(e.type) {
			case "mousedown":
				if (e.target == this._operator && this._resizable) {
					this._isResizing = true;
					if (this._width == null || this._width == "auto") {
						this._computeWidth();
					}

					this.resizeStart = e.clientX;
					this.startWidth = this._width;

					gara.EventManager.getInstance().addListener(document, "mousemove", this);
					gara.EventManager.getInstance().addListener(document, "mouseup", this);
				}

				if (e.target == this.domref && this._moveable) {
					this._isMoving = true;

					var shadowWidth = null;
					var order = this._table.getColumns();
					var offset = order.indexOf(this);

					this._shadow = new gara.jswt.Table(this._table.domref.parentNode, this._table.getStyle());
					this._shadow.setHeaderVisible(this._table.getHeaderVisible());

					this._table.getColumns().forEach(function(col, index, arr) {
						if (index == offset) {
							var c = new gara.jswt.TableColumn(this._shadow);
							shadowWidth = col.getWidth();
							c.setText(col.getText());
							c.setWidth(shadowWidth);
						}
					}, this);

					var cols = this._table.getColumnCount();
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
					
					gara.EventManager.getInstance().addListener(document, "mousemove", this);
					gara.EventManager.getInstance().addListener(document, "mouseup", this);
				}
				break;
			
			case "mousemove":
				if (this._isResizing) {
					var minWidth = 2;
					
					var delta = e.clientX - this.resizeStart;
					this._width = this.startWidth + delta;
					
					if (this._width > minWidth) {
						this.domref.style.width = this._width + "px";
					}
				}

				if (this._isMoving) {
					this._shadow.domref.style.left = e.clientX + 16 + "px";
					this._shadow.domref.style.top = e.clientY + 16 + "px";
				}
				break;

			case "mouseup":
				if (this._isResizing) {
					gara.EventManager.getInstance().removeListener({domNode:document, type:"mousemove", listener:this});
					gara.EventManager.getInstance().removeListener({domNode:document, type:"mouseup", listener:this});
					this._isResizing = false;
				}
				
				if (this._isMoving) {
					gara.EventManager.getInstance().removeListener({domNode:document, type:"mousemove", listener:this});
					gara.EventManager.getInstance().removeListener({domNode:document, type:"mouseup", listener:this});
					this._isMoving = false;
					this._table.domref.parentNode.removeChild(this._shadow.domref);
					
					delete this._shadow;
					
					this._shadow = null;
				
					if (e.target.obj && $class.instanceOf(e.target.obj, gara.jswt.TableColumn)
						&& e.target.obj.getParent() == this._table) {
						var col = e.target.obj;
						var colIndex = this._table.getColumns().indexOf(col);
						var colOrder = this._table.getColumnOrder();
						var orderIndex = colOrder.indexOf(colIndex);
						var thisColIndex = this._table.getColumns().indexOf(this);
						colOrder.remove(thisColIndex);
						colOrder.insertAt(thisColIndex, orderIndex);
						this._table.update();
					}
				}
				break;
		}
	},
	
	registerListener : function() {
		
	},
	
	setWidth : function(width) {
		this._width = width;
	},
	
	update : function() {
		if (this.domref == null) {
			this._create();
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
	}
});