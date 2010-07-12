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

gara.provide("gara.jswt.layout.Layout", "gara.jswt.widgets.Composite");

gara.use("gara.jswt.JSWT");
gara.use("gara.EventManager");

/**
 * @class Layout
 * @author Thomas Gossmann
 * @extends gara.jswt.widgets.Composite
 * @namespace gara.jsface.layout
 */
gara.Class("gara.jswt.layout.Layout", function() { return {

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
//			gara.EventManager.addListener(window, "resize", this);
//		}
	},

	construct : function (composite) {
		composite.addClass("jsWTLayout");
		
		if ((this.style & gara.jswt.JSWT.LAYOUT_LOOSY) !== 0) {
			composite.addClass("loosy");
		}
		

		if (composite.getParent().style && composite.getParent().style.position === "absolute") {
			composite.__garaLayoutResizeHandler = function () {
				composite.layout();
			};
			gara.EventManager.addListener(window, "resize", composite.__garaLayoutResizeHandler);
		}
	},
	
	deconstruct : function (composite) {
		composite.removeClass("jsWTLayout");
		
		if ((this.style & gara.jswt.JSWT.LAYOUT_LOOSY) !== 0) {
			composite.removeClass("loosy");
		}
		
		if (composite.getParent().style && composite.getParent().style.position === "absolute") {
			gara.EventManager.addListener(window, "resize", composite.__garaLayoutResizeHandler);
			delete composite.__garaLayoutResizeHandler;
		}
	},

	/**
	 * @method
	 * Recalculates this layout, based on the parents dimensions
	 */
	layout : function (composite) {
//		var tempHeight = composite.getHeight();
		composite.addClass("jsWTLayout");

		if (composite.getParent().style && composite.getParent().style.position === "absolute") {
			composite.setWidth(composite.getParent().offsetWidth);
			composite.setHeight(composite.getParent().offsetHeight);
		} else {
//			if (!(this.hasClass("w25") || this.hasClass("w50") || this.hasClass("w75") || this.hasClass("w33") || this.hasClass("w66"))) {
//				console.log("Layout.resize() -> set width");
//				this.setWidth(this.handle.offsetWidth - gara.getNumStyle(this.handle, "margin-left") - gara.getNumStyle(this.handle, "margin-right"));
//			}
//			if (!(this.hasClass("h25") || this.hasClass("h50") || this.hasClass("h75") || this.hasClass("h33") || this.hasClass("h66"))) {
//				console.log("Layout.resize -> width");
				composite.adjustHeight(composite.handle.offsetHeight - gara.getNumStyle(composite.handle, "margin-top") - gara.getNumStyle(composite.handle, "margin-bottom"));
//			}
//			this.height = tempHeight;


		}

		composite.getChildren().forEach(function (widget) {
			if (widget instanceof gara.jswt.widgets.Composite) {
				widget.layout();
			}
		});
	}
};});