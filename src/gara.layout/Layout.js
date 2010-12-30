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

gara.provide("gara.layout.Layout");

gara.use("gara.widgets.Composite");
gara.use("gara.widgets.Display");

/**
 * @class Layout
 * @author Thomas Gossmann
 * @namespace gara.layout
 */
gara.Class("gara.layout.Layout", function() { return {

	/**
	 * @field
	 * Layout's style
	 * 
	 * @private
	 * @type {int}
	 */
	style : 0,
	
	$constructor : function (style) {
		this.style = style || 0;
//		if (parent.style && parent.style.position === "absolute") {
//			gara.addEventListener(window, "resize", this);
//		}
	},

	construct : function (composite) {
		composite.addClass("garaLayout");
		
		if ((this.style & gara.LAYOUT_LOOSY) !== 0) {
			composite.addClass("garaLoosyLayout");
		}
		

		if ((composite.getParent().style && composite.getParent().style.position === "absolute")
				|| composite.getParent() === gara.widgets.Display.getDefault()
				) {
			composite.setData("gara-layout-resize-handler", function () {
				composite.layout();
//				composite.update();
			});
			gara.addEventListener(window, "resize", composite.getData("gara-layout-resize-handler"));
			composite.handle.style.width = "";
			composite.handle.style.height = "";
			composite.handle.style.top = "0";
			composite.handle.style.right = "0";
			composite.handle.style.bottom = "0";
			composite.handle.style.left = "0";
		}
	},
	
	deconstruct : function (composite) {
		composite.removeClass("garaLayout");
		
		if ((this.style & gara.LAYOUT_LOOSY) !== 0) {
			composite.removeClass("garaLoosyLayout");
		}
		
		if (composite.getParent().style && composite.getParent().style.position === "absolute") {
			gara.addEventListener(window, "resize", composite.getData("gara-layout-resize-handler"));
			composite.setData("gara-layout-resize-handler", null);
		}
	},

	/**
	 * @method
	 * Recalculates this layout, based on the parents dimensions
	 */
	layout : function (composite) {
//		var tempHeight = composite.getHeight();

//		if (composite.getParent().style && composite.getParent().style.position === "absolute") {
//			console.log("Layout.layout, set 'absolute' widthxheight: " + composite.getParent().offsetWidth + "x" + composite.getParent().offsetHeight);
//			composite.setWidth(composite.getParent().offsetWidth);
//			composite.setHeight(composite.getParent().offsetHeight);
//		} else {
//			if (!(this.hasClass("w25") || this.hasClass("w50") || this.hasClass("w75") || this.hasClass("w33") || this.hasClass("w66"))) {
//				console.log("Layout.resize() -> set width");
//				this.setWidth(this.handle.offsetWidth - gara.getNumStyle(this.handle, "margin-left") - gara.getNumStyle(this.handle, "margin-right"));
//			}
//			if (!(this.hasClass("h25") || this.hasClass("h50") || this.hasClass("h75") || this.hasClass("h33") || this.hasClass("h66"))) {
//				console.log("Layout.resize -> width");
//				composite.adjustHeight(composite.handle.offsetHeight - gara.getNumStyle(composite.handle, "margin-top") - gara.getNumStyle(composite.handle, "margin-bottom"));
//			}
//			this.height = tempHeight;
//		}

		composite.getChildren().forEach(function (widget) {
			if (widget instanceof gara.widgets.Composite) {
				widget.layout();
			} else if (widget.update) {
				widget.update();
			}
		});
	}
};});