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

	$constructor : function(parent, style) {
		
		if (!$class.instanceOf(parent, gara.jswt.Table)) {
			throw new TypeError("parent is not a gara.jswt.Table");
		}

		this.$base(parent, style);

		this._table = parent;
		this._table._addColumn(this);

		this._width = null;
		this._img = null;
		this._spanText = null
		this._operator = null;
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
	
	handleEvent : function(e) {
		switch(e.type) {
			case "mousedown":
				if (e.target == this._operator) {
					if (this._width == null || this._width == "auto") {
						this._computeWidth();
					}

					this.resizeStart = e.clientX;
					this.startWidth = this._width;

					gara.EventManager.getInstance().addListener(document, "mousemove", this);
					gara.EventManager.getInstance().addListener(document, "mouseup", this);
				}
				break;
			
			case "mousemove":
				var minWidth = 2;
				
				var delta = e.clientX - this.resizeStart;
				this._width = this.startWidth + delta;
				console.log("resizing, delta: " + delta);
				
				if (this._width > minWidth) {
					this.domref.style.width = this._width + "px";
				}
				break;
			
			case "mouseup":
				if (e.target == this._operator) {
					gara.EventManager.getInstance().removeListener({domNode:document, type:"mousemove", listener:this});
					gara.EventManager.getInstance().removeListener({domNode:document, type:"mouseup", listener:this});
				}
				break;
		}
	},
	
	registerListener : function() {
		
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
	}
});